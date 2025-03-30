"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    canvas_base_url: "",
    access_token: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("https://eduprogressbackend.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || "Registration failed");
    } else {
      setSuccess("Account created successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />
      <input
  type="text"
  name="canvas_base_url"
  placeholder="Canvas Base URL"
  value={form.canvas_base_url}
  onChange={handleChange}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
  required
/>
<input
  type="text"
  name="access_token"
  placeholder="Access Token"
  value={form.access_token}
  onChange={handleChange}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
  required
/>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Register
      </button>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Login
        </button>
      </div>
    </form>
  );
}
