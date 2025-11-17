// src/pages/Journal.jsx
import React, { useEffect, useState } from "react";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [dominant, setDominant] = useState("neutral");
  const [trend, setTrend] = useState("flat");
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [insightsRes, journalRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/insights"),
          fetch("http://127.0.0.1:8000/journal"),
        ]);

        if (!insightsRes.ok || !journalRes.ok) {
          throw new Error("Backend not reachable");
        }

        const insights = await insightsRes.json();
        const journal = await journalRes.json();

        setStreak(insights.streak || 0);
        setDominant(insights.dominant || "neutral");
        setTrend(insights.trend || "flat");
        setEntries(journal || []);
      } catch (e) {
        setError("Couldn’t load journal. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const chipColor = (emotion) => {
    const e = (emotion || "").toLowerCase();
    if (e === "happiness" || e === "joy") return "bg-emerald-600/20 text-emerald-300 border-emerald-500/30";
    if (e === "calm") return "bg-sky-600/20 text-sky-300 border-sky-500/30";
    if (e === "neutral") return "bg-slate-600/20 text-slate-300 border-slate-500/30";
    if (e === "anxiety") return "bg-amber-600/20 text-amber-300 border-amber-500/30";
    if (e === "sadness") return "bg-blue-600/20 text-blue-300 border-blue-500/30";
    if (e === "anger") return "bg-rose-600/20 text-rose-300 border-rose-500/30";
    return "bg-slate-600/20 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">📝 Journal</h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm">
              Streak: <span className="font-semibold">{streak}</span> day{streak === 1 ? "" : "s"}
            </span>
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm">
              Dominant: <span className="font-semibold capitalize">{dominant}</span>
            </span>
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm">
              Trend: <span className="font-semibold capitalize">{trend}</span>
            </span>
          </div>
        </header>

        {loading && (
          <div className="text-slate-300">Loading your journal…</div>
        )}

        {error && (
          <div className="text-rose-300 bg-rose-900/20 border border-rose-700/40 p-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-slate-300">
            No entries yet. Say hi in <span className="font-semibold">Chat</span> — messages are saved here.
          </div>
        )}

        <ul className="space-y-3">
          {entries
            .slice()
            .reverse()
            .map((e, idx) => (
              <li
                key={idx}
                className="border border-white/10 bg-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${chipColor(e.emotion)}`}>
                    {e.emotion}
                  </span>
                  <span className="text-xs text-slate-400">{e.date}</span>
                </div>
                <p className="text-slate-200 whitespace-pre-wrap">{e.text}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
