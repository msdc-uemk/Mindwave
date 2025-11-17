import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";          // new welcome page
import Chat from "./pages/Chat.jsx";          // your old chatbot file, renamed
import Graph from "./pages/Graph.jsx";
import Assessments from "./pages/Assessments.jsx";
import Games from "./pages/Games.jsx";
import Journal from "./pages/Journal";


export default function App() {
  return (
    <BrowserRouter basename="/Mindwave">


      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />              {/* New landing page */}
            <Route path="/chat" element={<Chat />} />          {/* Chatbot page */}
            <Route path="/graph" element={<Graph />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/games" element={<Games />} />
            <Route path="/journal" element={<Journal />} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
