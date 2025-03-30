import Link from "next/link";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Welcome Back 👋</h1>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link
            href="/register"
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
