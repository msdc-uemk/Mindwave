import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatArea() {
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("mindwave_chat")) || []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("mindwave_chat", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", {
        text: input,
      });

      const botMsg = {
        sender: "bot",
        text: res.data.llm_cbt,
        trigger_assessment: res.data.trigger_assessment,
        trigger_reason: res.data.trigger_reason,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong, please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 bg-card rounded-2xl p-4 shadow-inner">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.text}
              {msg.trigger_assessment && (
                <div className="mt-2 text-sm text-yellow-400">
                  {msg.trigger_reason}
                  <br />
                  👉 Take a quick <b>{msg.trigger_assessment}</b> test.
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-muted-foreground animate-pulse">Thinking...</p>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your thoughts here..."
          className="flex-1 resize-none p-3 rounded-2xl bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
