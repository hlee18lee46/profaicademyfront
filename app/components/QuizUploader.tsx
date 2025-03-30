// components/QuizUploader.tsx
"use client";
import { useState } from "react";

export default function QuizUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://eduprogressbackend.onrender.com/upload_pdf", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || "Upload complete!");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">Generate Quiz</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
