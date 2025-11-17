import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, HeartPulse, Activity, SmilePlus } from "lucide-react";

export default function Assessments() {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Question banks ---
  const tests = {
    phq9: {
      name: "PHQ-9",
      icon: <Brain className="h-5 w-5 text-sky-400" />,
      desc: "Depression self-assessment — measures mood and motivation.",
      endpoint: "/phq9",
      questions: [
        "Little interest or pleasure in doing things?",
        "Feeling down, depressed, or hopeless?",
        "Trouble falling or staying asleep, or sleeping too much?",
        "Feeling tired or having little energy?",
        "Poor appetite or overeating?",
        "Feeling bad about yourself, or that you’re a failure?",
        "Trouble concentrating on things?",
        "Moving or speaking slowly, or being fidgety?",
        "Thoughts that you’d be better off dead or hurting yourself?",
      ],
    },
    gad7: {
      name: "GAD-7",
      icon: <HeartPulse className="h-5 w-5 text-purple-400" />,
      desc: "Anxiety self-check — tracks nervousness and worry frequency.",
      endpoint: "/gad7",
      questions: [
        "Feeling nervous, anxious, or on edge?",
        "Not being able to stop or control worrying?",
        "Worrying too much about different things?",
        "Trouble relaxing?",
        "Being so restless that it’s hard to sit still?",
        "Becoming easily annoyed or irritable?",
        "Feeling afraid as if something awful might happen?",
      ],
    },
    pss: {
      name: "PSS",
      icon: <Activity className="h-5 w-5 text-emerald-400" />,
      desc: "Stress perception scale — how overwhelming life feels lately.",
      endpoint: "/pss",
      questions: [
        "Upset because of unexpected events?",
        "Felt unable to control important things in your life?",
        "Felt nervous and stressed?",
        "Confident about your ability to handle problems?",
        "Felt that things were going your way?",
        "Felt difficulties piling up so high that you can’t overcome them?",
      ],
    },
  };

  // --- API submission ---
  const submitTest = async () => {
    if (answers.length !== tests[activeTest].questions.length) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000${tests[activeTest].endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Server not responding. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- Answer selection ---
  const setAnswer = (index, val) => {
    const newAns = [...answers];
    newAns[index] = val;
    setAnswers(newAns);
  };

  // --- Emoji labels ---
  const labels = ["😃 0", "🙂 1", "😐 2", "😞 3"];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1220] text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold text-center mb-6"
      >
        🧠 MindWave Check-Ins
      </motion.h1>

      {!activeTest && (
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Object.entries(tests).map(([key, t]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 cursor-pointer hover:bg-white/10 transition"
              onClick={() => {
                setActiveTest(key);
                setAnswers([]);
                setResult(null);
              }}
            >
              <div className="flex items-center gap-2 text-lg font-semibold">
                {t.icon}
                {t.name}
              </div>
              <p className="mt-2 text-sm text-slate-300">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      )}

      {activeTest && !result && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-sky-400 mb-4">{tests[activeTest].name}</h2>

          {tests[activeTest].questions.map((q, i) => (
            <div key={i} className="mb-5">
              <p className="text-slate-200 mb-2">{i + 1}. {q}</p>
              <div className="flex gap-3">
                {labels.map((lbl, val) => (
                  <button
                    key={val}
                    onClick={() => setAnswer(i, val)}
                    className={`px-3 py-2 rounded-xl border border-white/10 ${
                      answers[i] === val ? "bg-sky-600" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              onClick={submitTest}
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-500 px-6 py-2 rounded-xl transition"
            >
              {loading ? "Calculating..." : "Submit"}
            </button>
            <button
              onClick={() => setActiveTest(null)}
              className="bg-white/10 border border-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-8 text-center border border-white/10 bg-white/5 rounded-2xl p-8"
        >
          <SmilePlus className="h-10 w-10 mx-auto text-sky-400 mb-2" />
          <h3 className="text-2xl font-semibold mb-2">
            {tests[activeTest].name} Results
          </h3>
          <p className="text-slate-300">
            <strong>Total:</strong> {result.total} <br />
            <strong>Severity:</strong> {result.severity} <br />
            <strong>Advice:</strong> {result.advice}
          </p>
          <button
            onClick={() => setActiveTest(null)}
            className="mt-6 bg-sky-600 hover:bg-sky-500 px-6 py-2 rounded-xl transition"
          >
            Back to Tests
          </button>
        </motion.div>
      )}
    </div>
  );
}
