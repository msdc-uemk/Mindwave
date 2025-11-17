from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import os
from datetime import date, timedelta, datetime
from collections import Counter, defaultdict

from db import init_db, get_session, Journal, Feedback
from ml_core import full_emotion_analysis, forecast_next
from cbt_engine import cbt_reframe
from llm_cbt import generate_cbt_response
from recommend import recommend_action
from interventions import suggest_for
from assess.phq9 import score_phq9
from assess.gad7 import score_gad7
from assess.pss import score_pss
from sqlmodel import select


load_dotenv()
init_db()

app = FastAPI(title=os.getenv("APP_NAME", "MindWave API"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""https://piyushgh07.github.io","https://piyushgh07.github.io/Mindwave""],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


EMOTION_SCORE = {
    "happiness": 2,
    "joy": 2,
    "calm": 1,
    "neutral": 0,
    "sadness": -1,
    "anxiety": -1,
    "anger": -2,
    "fear": -2,
}


class AnalyzeIn(BaseModel):
    text: str


class AnalyzeOut(BaseModel):
    emotion: str
    confidence: float
    crisis: bool
    crisis_info: Dict[str, Any]
    forecast: str
    tips: List[str]
    cbt: Dict[str, Any]
    llm_cbt: str
    recommendation: Optional[str] = None
    
    trigger_assessment: Optional[str] = None
    trigger_reason: Optional[str] = None


class ScaleIn(BaseModel):
    answers: List[int]


class ScaleOut(BaseModel):
    total: int
    severity: str
    advice: str



@app.get("/")
def root():
    return {
        "name": "MindWave API",
        "endpoints": [
            "/analyze", "/cbt/llm", "/phq9", "/gad7", "/pss",
            "/feedback", "/analytics", "/journal", "/journal_agg",
            "/insights", "/context",
        ],
    }


@app.post("/analyze", response_model=AnalyzeOut)
def analyze(payload: AnalyzeIn, session=Depends(get_session)):
    
    analysis = full_emotion_analysis(payload.text)
    label = analysis["emotion"]
    conf = analysis["confidence"]
    stress = analysis["stress_level"]
    crisis = analysis["crisis"]
    forecast = forecast_next()

   
    tips = crisis["helplines"] if crisis["flag"] else suggest_for(label)
    cbt = cbt_reframe(payload.text)
    llm_resp = generate_cbt_response(payload.text)
    action = recommend_action(label)

    
    entry = Journal(
        text=payload.text,
        emotion=label,
        confidence=conf,
        forecast=forecast,
        stress_level=stress,
        crisis_flag=crisis["flag"],
    )
    session.add(entry)
    session.commit()

    
    response_text = llm_resp
    if stress > 0.7 or crisis["flag"]:
        response_text += "\n\n💡 Try some deep breathing or reach out — you're not alone."

    
    recent = session.exec(select(Journal).order_by(Journal.id.desc()).limit(50)).all()
    emo_count = Counter([e.emotion.lower() for e in recent])

    trigger_assessment = None
    trigger_reason = None

    if emo_count.get("anxiety", 0) >= 5:
        trigger_assessment = "GAD7"
        trigger_reason = f"I’ve noticed {emo_count['anxiety']} anxiety-related entries recently. It might help to take a quick GAD-7 test."
    elif emo_count.get("sadness", 0) >= 5:
        trigger_assessment = "PHQ9"
        trigger_reason = f"You’ve shown signs of sadness {emo_count['sadness']} times lately. A PHQ-9 check could give some clarity."
    elif (emo_count.get("anxiety", 0) + emo_count.get("anger", 0)) >= 5:
        trigger_assessment = "PSS"
        trigger_reason = f"I’ve noticed elevated stress patterns ({emo_count.get('anxiety', 0)} anxiety + {emo_count.get('anger', 0)} anger signals). A quick PSS might help."

    
    return AnalyzeOut(
        emotion=label,
        confidence=round(conf, 3),
        crisis=crisis["flag"],
        crisis_info=crisis,
        forecast=forecast,
        tips=tips,
        cbt=cbt,
        llm_cbt=response_text,
        recommendation=action["message"],
        trigger_assessment=trigger_assessment,
        trigger_reason=trigger_reason,
    )



def _to_date(iso_str):
    return datetime.fromisoformat(iso_str).date()


def aggregate_entries(entries, period="week"):
    today = date.today()
    start = today - timedelta(days=29 if period == "month" else 6)

    bucket = defaultdict(lambda: {"emotion": [], "stress": []})
    for e in entries:
        d = _to_date(e.created_at)
        if d >= start:
            emo_score = EMOTION_SCORE.get(e.emotion, 0) * (float(e.confidence) or 0.5)
            bucket[d]["emotion"].append(emo_score)
            bucket[d]["stress"].append(e.stress_level or 0)

    data = []
    cur = start
    while cur <= today:
        emo_vals = bucket[cur]["emotion"]
        stress_vals = bucket[cur]["stress"]
        avg_emo = sum(emo_vals) / len(emo_vals) if emo_vals else None
        avg_stress = sum(stress_vals) / len(stress_vals) if stress_vals else None
        data.append({
            "date": cur.isoformat(),
            "avg_emotion": avg_emo,
            "avg_stress": avg_stress,
        })
        cur += timedelta(days=1)
    return data


@app.get("/journal_agg")
def journal_agg(period: str = "week", session=Depends(get_session)):
    entries = session.exec(select(Journal).order_by(Journal.id)).all()
    return aggregate_entries(entries, period)


@app.get("/journal")
def get_journal(session=Depends(get_session)):
    entries = session.exec(select(Journal).order_by(Journal.id.desc())).all()
    return [
        {
            "id": e.id,
            "text": e.text,
            "emotion": e.emotion,
            "confidence": e.confidence,
            "stress_level": e.stress_level,
            "date": e.created_at.split("T")[0] if isinstance(e.created_at, str) else e.created_at.strftime("%Y-%m-%d"),
        }
        for e in entries
    ]




@app.get("/insights")
def insights(session=Depends(get_session)):
    entries = session.exec(select(Journal).order_by(Journal.id)).all()
    if not entries:
        return {
            "message": "Starting is the hardest step. You did it 💙",
            "trend": "flat",
            "dominant": "neutral",
            "streak": 0,
            "suggestion": "Try journaling one small thought today.",
        }

    recent = [e for e in entries if _to_date(e.created_at) >= date.today() - timedelta(days=6)]
    dom = Counter([e.emotion for e in recent]).most_common(1)[0][0] if recent else "neutral"

    days = {_to_date(e.created_at) for e in entries}
    today = date.today()
    streak = 0
    while today in days:
        streak += 1
        today -= timedelta(days=1)

    scores = [EMOTION_SCORE.get(e.emotion, 0) for e in entries]
    trend = "improving" if len(scores) >= 6 and sum(scores[-3:]) > sum(scores[-6:-3]) else "flat"

    return {
        "message": {
            "improving": "You’re trending upward — small wins matter. 🌱",
            "flat": "Steady is progress too. Keep showing up. 🌿",
        }[trend],
        "trend": trend,
        "dominant": dom,
        "streak": streak,
        "suggestion": {
            "improving": "Keep journaling or play the Breathing Orb.",
            "flat": "Maybe try a PHQ-9 or GAD-7 test today.",
        }[trend],
    }



@app.post("/phq9", response_model=ScaleOut)
def phq9(payload: ScaleIn):
    total, sev, advice = score_phq9(payload.answers)
    return ScaleOut(total=total, severity=sev, advice=advice)


@app.post("/gad7", response_model=ScaleOut)
def gad7(payload: ScaleIn):
    total, sev, advice = score_gad7(payload.answers)
    return ScaleOut(total=total, severity=sev, advice=advice)


@app.post("/pss", response_model=ScaleOut)
def pss(payload: ScaleIn):
    total, sev, advice = score_pss(payload.answers)
    return ScaleOut(total=total, severity=sev, advice=advice)



@app.get("/context")
def get_user_context(session=Depends(get_session)):
    entries = session.exec(select(Journal).order_by(Journal.id.desc()).limit(5)).all()
    if not entries:
        return {
            "message": "Hey 👋 I’m MindWave — how are you feeling today?",
            "trend": "neutral",
            "recent_emotions": [],
        }

    recent = [e.emotion for e in entries[::-1]]
    dom = Counter(recent).most_common(1)[0][0]
    scores = [EMOTION_SCORE.get(e, 0) for e in recent]
    trend_value = sum(scores[-3:]) - sum(scores[:3])
    trend = "improving" if trend_value > 0 else "declining" if trend_value < 0 else "neutral"

    messages = {
        "improving": "Welcome back 🌞 looks like things are getting better lately — how’s your mood?",
        "declining": "Hey 💙 looks like it’s been rough. Want to talk?",
        "neutral": "Hey 👋 just checking in — how are you feeling today?",
    }
    return {"message": messages[trend], "trend": trend, "dominant": dom, "recent_emotions": recent}

