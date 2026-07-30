import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaHistory,
  FaVideo,
  FaClock,
  FaUserTie,
} from "react-icons/fa";
import { getCandidateInterviews } from "../services/liveInterviewService";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await getCandidateInterviews();
        setInterviews(data || []);
      } catch (error) {
        console.error("Error fetching candidate interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const upcomingInterviews = interviews.filter(
    (item) => item.status === "Scheduled" || item.status === "Ongoing"
  );
  const previousInterviews = interviews.filter(
    (item) => item.status === "Completed" || item.status === "Cancelled"
  );

  const [meetingCodeInput, setMeetingCodeInput] = useState("");

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!meetingCodeInput.trim()) return;
    const code = meetingCodeInput.trim();
    navigate(`/interview-room/${code}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}

      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Candidate Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Manage your live interviews here.
          </p>
        </div>

        <button
          onClick={() => navigate("/live-history")}
          className="bg-white border px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 shadow-sm"
        >
          View Full History
        </button>
      </div>

      {/* Join via Meeting Code Card */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold">Have a Meeting Code?</h2>
          <p className="text-blue-100 text-sm mt-1">
            Enter the code shared by your interviewer to join the live video room immediately.
          </p>
        </div>

        <form onSubmit={handleJoinByCode} className="w-full md:w-auto flex items-center gap-3">
          <input
            type="text"
            value={meetingCodeInput}
            onChange={(e) => setMeetingCodeInput(e.target.value)}
            placeholder="Enter code (e.g. room-xxxx)"
            className="bg-white text-gray-800 px-4 py-3 rounded-xl text-sm outline-none font-mono font-semibold placeholder-gray-400 w-full md:w-64 border border-blue-300 focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={!meetingCodeInput.trim()}
            className="bg-black hover:bg-gray-900 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition shadow"
          >
            Join Room
          </button>
        </form>
      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow p-6">
          <FaCalendarAlt className="text-blue-500 text-3xl mb-3" />

          <h2 className="text-3xl font-bold">
            {upcomingInterviews.length}
          </h2>

          <p className="text-gray-500">
            Upcoming Interviews
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaHistory className="text-green-500 text-3xl mb-3" />

          <h2 className="text-3xl font-bold">
            {previousInterviews.length}
          </h2>

          <p className="text-gray-500">
            Completed Interviews
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaVideo className="text-purple-500 text-3xl mb-3" />

          <h2 className="text-3xl font-bold">
            {interviews.length}
          </h2>

          <p className="text-gray-500">
            Total Live Meetings
          </p>
        </div>

      </div>

      {/* Upcoming */}

      <div className="bg-white rounded-xl shadow mb-8">

        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            Upcoming & Live Interviews
          </h2>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading scheduled interviews...</div>
          ) : upcomingInterviews.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No upcoming interviews scheduled yet.</div>
          ) : (
            upcomingInterviews.map((item) => (

              <div
                key={item._id}
                className="flex flex-col lg:flex-row justify-between items-center p-6 gap-5 hover:bg-gray-50 transition"
              >

                <div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                    <FaUserTie className="text-blue-600" />
                    Interviewer: <span className="font-medium text-gray-700">{item.hrId?.name || "HR Manager"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                    <FaClock className="text-amber-500" />
                    {new Date(item.scheduledAt).toLocaleDateString()} at{" "}
                    {new Date(item.scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-semibold ${
                      item.status === "Ongoing"
                        ? "bg-green-100 text-green-700 animate-pulse"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  <button
                    onClick={() => navigate(`/interview-room/${item._id}`)}
                    className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 font-medium text-sm transition"
                  >
                    Join Room
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

      {/* Previous */}

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            Previous Interviews
          </h2>
        </div>

        <div className="divide-y">

          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading history...</div>
          ) : previousInterviews.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No previous interviews found.</div>
          ) : (
            previousInterviews.map((item) => (

              <div
                key={item._id}
                className="flex flex-col lg:flex-row justify-between items-center p-6 gap-5 hover:bg-gray-50 transition"
              >

                <div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Interviewer: {item.hrId?.name || "HR Manager"}
                  </p>

                  <p className="text-gray-400 text-xs mt-1">
                    Date: {new Date(item.scheduledAt).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  <button
                    onClick={() => navigate(`/interview/${item._id}`)}
                    className="border border-gray-300 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
                  >
                    Details
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default CandidateDashboard;