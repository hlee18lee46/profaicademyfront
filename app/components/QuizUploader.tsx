"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

export default function QuizUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    setQuiz(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://b55e-150-250-6-64.ngrok-free.app/generate_quiz/gemini", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.quiz) {
        setQuiz(data.quiz);
        setMessage("✅ Quiz generated successfully!");
      } else {
        setMessage("⚠️ Failed to generate quiz.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Error uploading file or generating quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">📝 Generate Quiz from PDF</h2>
      
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-1 rounded ${loading && "opacity-50 cursor-not-allowed"}`}
      >
        {loading ? "Generating..." : "Upload and Generate Quiz"}
      </button>
      <button
            onClick={() => router.push("/quiz")}
            className="mt-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Let's Quiz
          </button>

      {message && <p className="mt-2 text-sm">{message}</p>}

      {quiz && (
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold text-md mb-1">Generated Quiz:</h3>
          <div className="bg-gray-50 p-3 rounded-md shadow-sm">
            <p className="font-medium">1. {quiz.question}</p>
            <ul className="list-disc ml-5 text-sm mt-1">
              {quiz.choices.map((choice, i) => (
                <li key={i}>{choice}</li>
              ))}
            </ul>
            <p className="mt-1 text-green-700 text-sm">Answer: {quiz.answer}</p>
          </div>
          <button
            onClick={() => router.push("/quiz")}
            className="mt-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Let's Quiz
          </button>
        </div>
      )}
    </div>
  );
}