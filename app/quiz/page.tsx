"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch("https://eduprogressbackend.onrender.com/quizzes");
        const data = await res.json();
        if (data.quizzes && data.quizzes.length > 0) {
          const allQuizQuestions: QuizQuestion[] = data.quizzes.flatMap((q: any) =>
            Array.isArray(q.quiz) ? q.quiz : [q.quiz]
          );
          setQuizzes(allQuizQuestions);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const handleAnswer = (choice: string) => {
    setSelected(choice);
    if (choice === quizzes[current].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (current + 1 < quizzes.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowResult(true);
    }
  };

  if (loading) return <p className="p-6 text-center text-gray-600">Loading quiz...</p>;
  if (quizzes.length === 0) return <p className="p-6 text-red-500 text-center">❌ No quiz data found.</p>;

  if (showResult) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center bg-white shadow-md rounded-xl">
        <h2 className="text-3xl font-bold text-green-600 mb-3">🎉 Quiz Complete!</h2>
        <p className="text-lg">Your score: <strong>{score}</strong> / {quizzes.length}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          🔙 Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = quizzes[current];

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${((current + 1) / quizzes.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1 text-right">
          Question {current + 1} of {quizzes.length}
        </p>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold mb-2">🧠 {currentQuestion.question}</h2>

      {/* Choices */}
      <ul className="space-y-2">
        {currentQuestion.choices.map((choice, i) => {
          const isCorrect = choice === currentQuestion.answer;
          const isSelected = choice === selected;

          return (
            <li
              key={i}
              onClick={() => handleAnswer(choice)}
              className={`p-3 rounded border cursor-pointer transition-all ${
                isSelected
                  ? isCorrect
                    ? "bg-green-200 border-green-400"
                    : "bg-red-200 border-red-400"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              {choice}
              {isSelected && (
                <span className="ml-2">
                  {isCorrect ? "✅" : "❌"}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Next Button */}
      <button
        onClick={nextQuestion}
        disabled={!selected}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 transition"
      >
        {current + 1 < quizzes.length ? "Next →" : "Finish ✅"}
      </button>
    </div>
  );
}