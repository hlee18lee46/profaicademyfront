// components/Chatbot.tsx
"use client";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    setMessages([...messages, `You: ${input}`, `Bot: (Gemini reply)`]);
    setInput("");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md h-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">Gemini Chatbot</h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded">{msg}</div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="border flex-1 p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
