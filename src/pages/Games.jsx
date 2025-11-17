import React, { useState } from "react";
import Breathing from "../components/games/Breathing.jsx";
import FocusDot from "../components/games/FocusDot.jsx";
import ColorMemory from "../components/games/ColorMemory.jsx";

export default function Games() {
  const [active, setActive] = useState("Breathing");

  const games = {
    Breathing: <Breathing />,
    Focus: <FocusDot />,
    Memory: <ColorMemory />,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="flex gap-4 mb-6">
        {Object.keys(games).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-full border transition-all ${
              active === key
                ? "bg-waveBlue text-white"
                : "border-waveBlue text-waveBlue hover:bg-waveBlue/10"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg w-[90%] md:w-[400px] text-center">
        {games[active]}
      </div>
    </div>
  );
}
