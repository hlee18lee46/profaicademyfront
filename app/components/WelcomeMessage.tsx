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

interface Assignment {
  name: string;
  due_at?: string;
  points_possible?: number;
  grade?: string;
}

export default function WelcomeMessage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, Assignment[]>>({});

  const getCourseStatus = (start_at?: string, end_at?: string): string => {
    const now = new Date();
    const start = start_at ? new Date(start_at) : null;
    const end = end_at ? new Date(end_at) : null;
    if (start && now < start) return "Upcoming";
    if (end && now > end) return "Past";
    if (start || end) return "Current";
    return "Unknown";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const profileRes = await axios.get("https://eduprogressbackend.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        const courseRes = await axios.get("https://eduprogressbackend.onrender.com/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(courseRes.data);
      } catch (err: any) {
        setError("Failed to load profile or courses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCourse = async (courseId: number) => {
    const token = localStorage.getItem("token");

    if (expandedCourse === courseId) {
      setExpandedCourse(null); // collapse
    } else {
      setExpandedCourse(courseId); // expand

      // Only fetch if not already fetched
      if (!assignments[courseId]) {
        try {
          const res = await axios.get(
            `https://eduprogressbackend.onrender.com/canvas/courses/${courseId}/assignments/save`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAssignments((prev) => ({ ...prev, [courseId]: res.data.assignments || [] }));
        } catch (err) {
          console.error(`❌ Failed to fetch assignments for course ${courseId}`, err);
        }
      }
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
                  : "bg-red-100 text-red-700";

              const isExpanded = expandedCourse === course.canvas_course_id;

              return (
                <li key={index} className="bg-blue-50 rounded-xl shadow-sm">
                  <div
                    onClick={() => toggleCourse(course.canvas_course_id)}
                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-blue-100 rounded-t-xl"
                  >
                    <div>
                      <p className="font-medium text-blue-800">{course.name}</p>
                      <p className="text-sm text-gray-600">{course.course_code}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                      {status}
                    </span>
                  </div>

                  {/* Assignments Dropdown */}
                  {isExpanded && assignments[course.canvas_course_id] && (
                    <div className="bg-white px-4 pb-3 pt-2 space-y-2 text-sm rounded-b-xl border-t">
                      {assignments[course.canvas_course_id].length === 0 ? (
                        <p className="text-gray-500 italic">No assignments found.</p>
                      ) : (
                        assignments[course.canvas_course_id].map((a, i) => (
                          <div key={i} className="border p-2 rounded bg-gray-50">
                            <p className="font-medium">{a.name}</p>
                            {a.due_at && (
                              <p className="text-xs text-gray-600">Due: {new Date(a.due_at).toLocaleString()}</p>
                            )}
                            {a.points_possible !== undefined && (
                              <p className="text-xs text-gray-600">Points: {a.points_possible}</p>
                            )}
                            {a.grade && (
                              <p className="text-xs text-blue-600 font-semibold">Grade: {a.grade}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}