import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  MessageSquareHeart,
  BarChart2,
  Gamepad2,
  ClipboardCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [darkMode, setDarkMode] = React.useState(true);

  const active = (path) =>
    location.pathname === path
      ? "text-sky-400"
      : "text-slate-300 hover:text-sky-400 transition-colors";

  // Theme toggle logic
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="w-full border-b border-white/10 bg-[#0b1220]/80 backdrop-blur-md overflow-x-hidden">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-3">
        {/* ---------- Brand Logo ---------- */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <Brain className="h-6 w-6 text-sky-400" />
          <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            MindWave
          </span>
        </Link>

        {/* ---------- Navigation Links ---------- */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={active("/")}>
            Home
          </Link>

          <Link to="/chat" className={active("/chat")}>
            <MessageSquareHeart className="inline-block mr-1 h-4 w-4" />
            Chat
          </Link>

          <Link to="/graph" className={active("/graph")}>
            <BarChart2 className="inline-block mr-1 h-4 w-4" />
            Mood Graph
          </Link>

          <Link to="/assessments" className={active("/assessments")}>
            <ClipboardCheck className="inline-block mr-1 h-4 w-4" />
            Assessments
          </Link>

          <Link to="/games" className={active("/games")}>
            <Gamepad2 className="inline-block mr-1 h-4 w-4" />
            Games
          </Link>
          <a href="/journal" className="hover:text-blue-400 transition-colors">
  Journal
</a>

        </div>

        {/* ---------- Theme Toggle ---------- */}
        
      </div>
    </nav>
  );
}
