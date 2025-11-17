import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const COLORS = [
  { name: "red", color: "bg-red-500" },
  { name: "green", color: "bg-green-500" },
  { name: "blue", color: "bg-blue-500" },
  { name: "yellow", color: "bg-yellow-400" },
];

export default function ColorMemory() {
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [level, setLevel] = useState(1);
  const [isShowing, setIsShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [message, setMessage] = useState("Watch carefully 👀");
  const [score, setScore] = useState(0);

  // Start first round
  useEffect(() => {
    startLevel();
  }, [level]);

  // Function to play back the sequence
  const playSequence = async (seq) => {
    setIsShowing(true);
    setMessage("Memorize the pattern...");
    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await new Promise((r) => setTimeout(r, 500));
      setActiveIndex(null);
      await new Promise((r) => setTimeout(r, 250));
    }
    setIsShowing(false);
    setMessage("Your turn! 🔥");
  };

  const startLevel = () => {
    const newSeq = Array.from({ length: level }, () =>
      Math.floor(Math.random() * COLORS.length)
    );
    setSequence(newSeq);
    setUserSeq([]);
    setActiveIndex(null);
    playSequence(newSeq);
  };

  const handleClick = async (idx) => {
    if (isShowing) return;
    const newSeq = [...userSeq, idx];
    setUserSeq(newSeq);
    setActiveIndex(idx);
    await new Promise((r) => setTimeout(r, 200));
    setActiveIndex(null);

    // Wrong move
    if (sequence[newSeq.length - 1] !== idx) {
      setMessage("❌ Wrong! Restarting from Level 1");
      setLevel(1);
      setScore(0);
      return;
    }

    // Completed round
    if (newSeq.length === sequence.length) {
      setMessage("✅ Great job! Next level loading...");
      setScore((s) => s + level * 10);
      setTimeout(() => setLevel((lvl) => lvl + 1), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-sky-100 via-indigo-100 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 transition-all duration-500">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 tracking-wide">
        Color Memory+
      </h1>

      <div className="text-lg text-gray-700 dark:text-gray-300">
        Level <span className="font-semibold text-indigo-500">{level}</span> | Score{" "}
        <span className="font-semibold text-indigo-500">{score}</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {COLORS.map((c, i) => (
          <motion.div
            key={i}
            onClick={() => handleClick(i)}
            animate={{
              scale: activeIndex === i ? 1.2 : 1,
              opacity: activeIndex === i || isShowing ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className={`w-28 h-28 rounded-xl cursor-pointer shadow-lg ${c.color}`}
          />
        ))}
      </div>

      <p className="text-md text-gray-600 dark:text-gray-400 mt-4">{message}</p>

      <button
        onClick={() => {
          setLevel(1);
          setScore(0);
          startLevel();
        }}
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
      >
        Restart
      </button>
    </div>
  );
}
