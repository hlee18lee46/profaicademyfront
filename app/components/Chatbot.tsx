"use client";

import { useState } from "react";

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState("");
  const [botReply, setBotReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    setBotReply(""); // Clear previous reply

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://eduprogressbackend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBotReply(`❌ ${data.detail || "Error occurred"}`);
      } else {
        setBotReply(data.reply);
      }
    } catch (error) {
      setBotReply("❌ Failed to connect to server");
      console.error(error);
    } finally {
      setLoading(false);
      setUserMessage("");
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
        {userMessage && <div className="bg-gray-100 p-2 rounded">You: {userMessage}</div>}
        {botReply && <div className="bg-gray-100 p-2 rounded">Bot: {botReply}</div>}
      </div>
      <div className="flex">
        <input
          className="border flex-1 p-2 rounded-l"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
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
