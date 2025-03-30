"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  name: string;
  primary_email: string;
}

interface Course {
  name: string;
  course_code: string;
  start_at?: string;
  end_at?: string;
  time_zone?: string;
}

export default function WelcomeMessage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch Profile
        const profileRes = await axios.get("https://eduprogressbackend.onrender.com/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(profileRes.data);

        // ✅ Fetch Courses
        const savedCourses = await axios.get("https://eduprogressbackend.onrender.com/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(savedCourses.data);
      } catch (err: any) {
        setError("Failed to load profile or courses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCourses();
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-4">🎉 Welcome to ProfAIcademy!</h1>

      {loading ? (
        <p className="text-gray-500">Loading profile and courses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {profile && (
            <div className="mb-4">
              <p className="text-lg font-semibold">👋 Welcome, {profile.name}!</p>
              <p className="text-sm text-gray-500">{profile.primary_email}</p>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-2">Your Courses</h2>
          <ul className="list-disc pl-5 space-y-1">
            {courses.map((course, index) => (
              <li key={index}>
                <span className="font-medium">{course.name}</span>{" "}
                <span className="text-gray-500 text-sm">({course.course_code})</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
