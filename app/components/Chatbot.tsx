"use client";

import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setLoading(true);
    setInput("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://eduprogressbackend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { user: userMsg, bot: `❌ ${data.detail || "Error occurred"}` }]);
      } else {
        setMessages((prev) => [...prev, { user: userMsg, bot: data.reply }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { user: userMsg, bot: "❌ Failed to connect to server" }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md h-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">💬 Gemini Chatbot</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 text-sm whitespace-pre-wrap">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className="bg-gray-100 p-2 rounded mb-1">You: {msg.user}</div>
            <div className="bg-blue-50 p-2 rounded">Bot: {msg.bot}</div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border flex-1 p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Waiting for reply..." : "Ask something..."}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className={`px-6 py-2 rounded-r text-white text-sm font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
