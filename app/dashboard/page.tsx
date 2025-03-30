// app/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import WelcomeMessage from "@/app/components/WelcomeMessage";
import Chatbot from "@/app/components/Chatbot";
import QuizUploader from "@/app/components/QuizUploader";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-4 p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Left: Welcome */}
      <motion.div
        className="col-span-1 bg-white shadow-xl rounded-2xl p-6"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeMessage />
      </motion.div>

      {/* Right side */}
      <div className="col-span-3 grid grid-rows-5 gap-4">
        {/* Top: Chatbot */}
        <motion.div
          className="row-span-4 bg-white shadow-xl rounded-2xl p-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Chatbot />
        </motion.div>

        {/* Bottom: Quiz Uploader */}
        <motion.div
          className="row-span-1 bg-white shadow-xl rounded-2xl p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <QuizUploader />
        </motion.div>
      </div>
    </div>
  );
}
