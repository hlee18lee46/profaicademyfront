"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  name: string;
  primary_email: string;
}

interface Course {
    canvas_course_id: number;
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

  // ⏰ Helper to get course status
  const getCourseStatus = (start_at?: string, end_at?: string): string => {
    const now = new Date();
  
    const start = start_at ? new Date(start_at) : null;
    const end = end_at ? new Date(end_at) : null;
  
    if (start && now < start) return "Upcoming";
    if (end && now > end) return "Past";
    if (start || end) return "Current"; // at least one exists, assume ongoing
    return "Unknown"; // neither date exists
  };
  

  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch Profile
        const profileRes = await axios.get("https://eduprogressbackend.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // ✅ Fetch Courses
        const savedCourses = await axios.get("https://eduprogressbackend.onrender.com/courses", {
          headers: { Authorization: `Bearer ${token}` },
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

  const fetchAssignments = async (courseId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `https://eduprogressbackend.onrender.com/canvas/courses/${courseId}/assignments/save`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`✅ Assignments saved for course ${courseId}:`, res.data);
    } catch (err) {
      console.error(`❌ Failed to fetch assignments for course ${courseId}:`, err);
    }
  };

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
          <ul className="list-none space-y-3">
            {courses.map((course, index) => {
              const status = getCourseStatus(course.start_at, course.end_at);
              const statusColor =
              status === "Current"
                ? "bg-green-100 text-green-700"
                : status === "Upcoming"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Past"
                ? "bg-gray-300 text-gray-700"
                : "bg-red-100 text-red-700"; // for "Unknown"
            

              return (
<li
  key={index}
  onClick={() => fetchAssignments(course.canvas_course_id)}
  className="bg-blue-50 p-3 rounded-xl flex justify-between items-center shadow-sm cursor-pointer hover:bg-blue-100"
>
                  <div>
                    <p className="font-medium text-blue-800">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.course_code}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
