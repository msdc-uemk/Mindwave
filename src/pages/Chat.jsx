import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Load old chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mindwave_chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ✅ Save messages to localStorage
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("mindwave_chat", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", { text: input });
      const data = res.data;

      const llmText = data.llm_cbt;
      const suggestion =
        data.trigger_assessment && data.trigger_reason
          ? `💡 ${data.trigger_reason}`
          : null;

      const delay = Math.min(Math.max(llmText.split(" ").length * 25, 400), 2500);

      setTimeout(() => {
        const botMsgs = [
          { sender: "bot", text: llmText, emotion: data.emotion },
        ];
        if (suggestion)
          botMsgs.push({
            sender: "bot",
            text: suggestion,
            type: "suggestion",
          });

        setMessages((prev) => [...prev, ...botMsgs]);
        setLoading(false);
      }, delay);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, something went wrong. Please try again.",
        },
      ]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("mindwave_chat");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#0b1220] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-700 bg-[#0f172a]">
        <h1 className="text-xl font-semibold text-sky-400 tracking-wide flex items-center gap-2">
          
        </h1>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-xs bg-red-500 rounded-md hover:bg-red-600 transition-all"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-sky-600 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white rounded-br-none"
                  : msg.type === "suggestion"
                  ? "bg-[#16213e] text-sky-300 italic border border-sky-600 rounded-tl-none"
                  : "bg-[#1e293b] text-gray-200 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-3 border-t border-gray-700 p-4 bg-[#0f172a]">
        <textarea
          className="flex-1 resize-none rounded-xl bg-[#1e293b] text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your thoughts..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
