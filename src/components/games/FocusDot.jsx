import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FocusDot() {
  const [showDot, setShowDot] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Wait for the dot...");
  const [waiting, setWaiting] = useState(true);
  const [bgColor, setBgColor] = useState("bg-gray-900");

  useEffect(() => {
    if (round > 0) startRound();
  }, [round]);

  const startRound = () => {
    setShowDot(false);
    setReactionTime(null);
    setWaiting(true);
    setMessage("Wait for the dot...");
    setBgColor("bg-gray-900");

    const delay = Math.random() * 3000 + 2000;
    const timer = setTimeout(() => {
      setShowDot(true);
      setStartTime(Date.now());
      setWaiting(false);
      setMessage("Click now!");
    }, delay);

    return () => clearTimeout(timer);
  };

  const handleClick = () => {
    // If user clicks before the dot appears
    if (waiting && !showDot) {
      setMessage("⏱ Too early! Restarting round...");
      setBgColor("bg-red-700");
      setTimeout(() => startRound(), 1500);
      return;
    }

    // If user clicks correctly
    if (showDot) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setShowDot(false);
      setWaiting(true);

      const roundScore = Math.max(0, 1000 - time); // faster = higher
      setScore((s) => s + roundScore);

      let color = "bg-green-700";
      if (time < 200) color = "bg-emerald-600";
      else if (time > 400) color = "bg-yellow-600";
      else if (time > 700) color = "bg-orange-600";

      setBgColor(color);
      setMessage(`⚡ ${time} ms! (+${roundScore} pts)`);

      setTimeout(() => {
        setRound((r) => r + 1);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setReactionTime(null);
    setMessage("Wait for the dot...");
    startRound();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center h-screen text-white transition-all duration-500 ${bgColor}`}
    >
      <h1 className="text-3xl font-bold mb-6">FocusDot+</h1>

      <div className="text-lg mb-2">
        Round <span className="font-semibold">{round}</span> | Score:{" "}
        <span className="font-semibold">{score}</span>
      </div>

      <AnimatePresence mode="wait">
        {showDot ? (
          <motion.div
            key="dot"
            className="w-14 h-14 bg-blue-400 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        ) : (
          <motion.p
            key="msg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-200 text-lg"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {reactionTime && (
        <p className="mt-4 text-sm text-gray-300">
          Avg speed improves with focus — keep going!
        </p>
      )}

      <button
        onClick={handleRestart}
        className="mt-8 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 shadow transition"
      >
        Restart Game
      </button>
    </div>
  );
}
