import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breathing from "./Breathing";
import ColorMemory from "./ColorMemory";
import FocusDot from "./FocusDot";

const games = [
  {
    id: "breathing",
    title: "🫁 Breathing Rhythm",
    desc: "Sync your breath and calm your mind. Follow the expanding circle.",
    color: "from-sky-400 to-indigo-500",
    component: <Breathing />,
  },
  {
    id: "colormemory",
    title: "🎨 Color Memory+",
    desc: "Test your memory! Watch the sequence and repeat it correctly.",
    color: "from-yellow-400 to-pink-500",
    component: <ColorMemory />,
  },
  {
    id: "focusdot",
    title: "⚡ FocusDot+",
    desc: "Challenge your reflexes. Tap as soon as the dot appears!",
    color: "from-emerald-400 to-cyan-500",
    component: <FocusDot />,
  },
];

export default function GameZone() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-indigo-100 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 transition-all duration-500">
      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-between w-full max-w-4xl px-8 mt-6">
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                {games.find((g) => g.id === activeGame).title}
              </h1>
              <button
                onClick={() => setActiveGame(null)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
              >
                ⬅ Back
              </button>
            </div>
            <div className="mt-10 w-full flex justify-center">
              {games.find((g) => g.id === activeGame).component}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-300 mb-10">
              🎮 Mind Gym — GameZone
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12">
              Boost your focus, calm, and cognition with these quick mindfulness mini-games.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`cursor-pointer p-6 rounded-2xl shadow-lg bg-gradient-to-br ${game.color} text-white`}
                  onClick={() => setActiveGame(game.id)}
                >
                  <h2 className="text-2xl font-semibold mb-2">{game.title}</h2>
                  <p className="text-sm opacity-90">{game.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
