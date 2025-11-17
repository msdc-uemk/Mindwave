import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useInsights from "../hooks/useInsights";
import MoodBackdrop from "../components/MoodBackdrop";
import { Brain, Sparkles, MessageSquareHeart } from "lucide-react";

export default function Home() {
  const { data, loading, err } = useInsights();
  const dominant = data?.dominant || "neutral";
  const streak = data?.streak ?? 0;
  const message = data?.message || "Loading your mood story…";
  const suggestion = data?.suggestion || "";

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-56px)] bg-[#0b1220] text-white">
      {/* Mood-reactive background */}
      <MoodBackdrop mood={dominant} />

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
        >
          <div className="flex items-start gap-3">
            <Brain className="h-7 w-7 text-sky-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Hey there 👋 I’m <span className="text-sky-400">MindWave</span> — your emotional wingman.
              </h1>
              <p className="mt-2 text-slate-300">
                Let’s track your mood, breathe a bit easier, and nudge tiny habits that actually help.
              </p>
            </div>
          </div>

          {/* Insight cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-300">Dominant mood (7d)</div>
              <div className="mt-1 text-xl font-semibold capitalize">{loading ? "…" : dominant}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-300">Journaling streak</div>
              <div className="mt-1 text-xl font-semibold">{loading ? "…" : `${streak} day${streak === 1 ? "" : "s"}`}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-300">Gentle note</div>
              <div className="mt-1 text-base">{loading ? "…" : message}</div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-5 py-3 transition-colors"
            >
              <MessageSquareHeart className="h-5 w-5" />
              Start chatting
            </Link>
            <Link
              to="/assessments"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 transition-colors"
            >
              <Sparkles className="h-5 w-5" />
              Take a quick check-in
            </Link>
          </div>

          {/* Suggestion footer */}
          {!loading && !err && suggestion && (
            <p className="mt-4 text-sm text-slate-300">
              Suggestion: <span className="text-slate-100">{suggestion}</span>
            </p>
          )}

          {err && (
            <p className="mt-4 text-sm text-rose-300">
              Couldn’t load insights — is the backend running?
            </p>
          )}
        </motion.div>

        {/* Friendly explainer section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          {[
            {
              title: "Track & reflect",
              desc: "Short notes become patterns. Patterns become progress.",
            },
            {
              title: "Gentle CBT nudges",
              desc: "When thoughts get heavy, we offer kinder alternatives.",
            },
            {
              title: "Act, don’t just see",
              desc: "Breathing orb, focus mini-games, and tiny habits that stick.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">{c.title}</div>
              <div className="mt-2 text-slate-300">{c.desc}</div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
