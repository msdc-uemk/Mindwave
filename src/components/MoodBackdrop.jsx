import React from "react";

const colors = {
  sadness: "from-sky-900/60 via-blue-900/60 to-indigo-900/60",
  anxiety: "from-indigo-900/60 via-purple-800/60 to-rose-800/60",
  anger: "from-rose-900/70 via-orange-800/60 to-red-900/60",
  calm: "from-emerald-900/60 via-green-800/60 to-teal-900/60",
  happiness: "from-yellow-800/50 via-orange-700/60 to-pink-700/60",
  neutral: "from-slate-900/70 via-gray-800/70 to-slate-900/70",
};

const glow = {
  sadness: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
  anxiety: "from-violet-500/20 via-fuchsia-500/10 to-purple-500/20",
  anger: "from-rose-500/25 via-red-500/15 to-orange-500/20",
  calm: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
  happiness: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
  neutral: "from-slate-500/20 via-slate-700/10 to-slate-900/20",
};

export default function MoodBackdrop({ mood = "neutral" }) {
  const deep = colors[mood.toLowerCase()] || colors.neutral;
  const soft = glow[mood.toLowerCase()] || glow.neutral;

  return (
    <>
      {/* Deep gradient background */}
      <div
        className={`fixed inset-0 bg-gradient-to-br ${deep} transition-all duration-700`}
        style={{ zIndex: -1 }}
        
    
      />

      {/* Soft emotional glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${soft} blur-2xl opacity-60 transition-all duration-700`}
        aria-hidden
        style={{ zIndex: -1 }}
      />
    </>
  );
}
