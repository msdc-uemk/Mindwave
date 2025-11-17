import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Breathing() {
  const phases = [
    { name: "Inhale", duration: 4000 },
    { name: "Hold", duration: 3000 },
    { name: "Exhale", duration: 4000 },
  ];

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  const phase = phases[phaseIndex].name;

  useEffect(() => {
    let progressInterval;
    const duration = phases[phaseIndex].duration;

    // Animate progress bar and phase cycling
    progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setPhaseIndex((i) => (i + 1) % phases.length);
          setScore((s) => s + 1);
          return 0;
        }
        return p + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [phaseIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 transition-all duration-500">
      {/* Expanding/Contracting Circle */}
      <motion.div
        className="w-52 h-52 rounded-full bg-blue-400/70 dark:bg-indigo-500/60 shadow-2xl"
        animate={{
          scale:
            phase === "Inhale" ? 1.5 : phase === "Hold" ? 1.2 : phase === "Exhale" ? 0.8 : 1,
        }}
        transition={{ duration: phases[phaseIndex].duration / 2000, ease: "easeInOut" }}
      />

      {/* Phase Title */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-indigo-600 dark:text-indigo-300 tracking-wide"
        >
          {phase}
        </motion.h2>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="w-64 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.div
          className="h-3 bg-indigo-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* Score + Hint */}
      <div className="flex flex-col items-center text-gray-600 dark:text-gray-300 text-sm">
        <p>Follow the rhythm. Stay synced with your breath.</p>
        <p className="mt-2 text-indigo-700 dark:text-indigo-400 font-semibold">
          Score: {score}
        </p>
      </div>
    </div>
  );
}
