import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { deleteTestData, getHRInterviews } from "../services/liveInterviewService";

function HRDashboard() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const refreshInterviews = async () => {
    try {
      const { data } = await getHRInterviews();
      setInterviews(data || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshInterviews();
  }, []);

  const handleClearTestData = async () => {
    try {
      const { data } = await deleteTestData();
      setMessage(data?.message || "Test data removed.");
      await refreshInterviews();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to clear test data.");
    }
  };

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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            HR Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and schedule candidate interviews.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClearTestData}
            className="flex items-center gap-2 border border-gray-300 bg-white px-5 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Clear Test Data
          </button>
          <button
            onClick={() => navigate("/schedule-interview")}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            <FaPlus />
            Schedule Interview
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* Join via Meeting Code Banner */}

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
        <div>
          <h2 className="text-xl font-bold">Join Live Room via Meeting Code</h2>
          <p className="text-slate-300 text-sm mt-1">
            Quickly enter any room using the meeting code or Room ID.
          </p>
        </div>

        <form onSubmit={handleJoinByCode} className="w-full md:w-auto flex items-center gap-3">
          <input
            type="text"
            value={meetingCodeInput}
            onChange={(e) => setMeetingCodeInput(e.target.value)}
            placeholder="Enter code (e.g. room-xxxx)"
            className="bg-slate-950 text-white px-4 py-3 rounded-xl text-sm outline-none font-mono font-semibold placeholder-slate-500 w-full md:w-64 border border-slate-700 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!meetingCodeInput.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition shadow"
          >
            Join Room
          </button>
        </form>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <FaCalendarAlt className="text-blue-500 text-2xl mb-3" />
          <h2 className="text-3xl font-bold">{interviews.length}</h2>
          <p className="text-gray-500">Total Interviews</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaClock className="text-yellow-500 text-2xl mb-3" />
          <h2 className="text-3xl font-bold">{interviews.filter((item) => item.status === "Scheduled").length}</h2>
          <p className="text-gray-500">Upcoming</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaCheckCircle className="text-green-500 text-2xl mb-3" />
          <h2 className="text-3xl font-bold">{interviews.filter((item) => item.status === "Completed").length}</h2>
          <p className="text-gray-500">Completed</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <FaUsers className="text-purple-500 text-2xl mb-3" />
          <h2 className="text-3xl font-bold">24</h2>
          <p className="text-gray-500">Candidates</p>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5 mb-8">

        <div className="flex items-center gap-3 border rounded-lg px-4 py-3">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search candidates..."
            className="outline-none flex-1"
          />

        </div>

      </div>

      {/* Upcoming Interviews */}

      <div className="bg-white rounded-xl shadow">

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-xl font-semibold">
            Upcoming Interviews
          </h2>

        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading interviews...</div>
          ) : interviews.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No interviews yet.</div>
          ) : (
          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4">Candidate</th>

                <th className="text-left px-6 py-4">Role</th>

                <th className="text-left px-6 py-4">Date</th>

                <th className="text-left px-6 py-4">Time</th>

                <th className="text-left px-6 py-4">Status</th>

                <th className="text-left px-6 py-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {interviews.map((item) => (

                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {item.candidateId?.name || "Candidate"}
                  </td>

                  <td className="px-6 py-4">
                    {item.title}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(item.scheduledAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(item.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">
                      {(item.status === "Scheduled" || item.status === "Ongoing") && (
                        <button
                          onClick={() => navigate(`/interview-room/${item._id}`)}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-xs font-semibold"
                        >
                          Join
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/interview/${item._id}`)}
                        className="bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 text-xs font-semibold"
                      >
                        View
                      </button>
                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
          )}

        </div>

      </div>

    </div>
  );
}

export default HRDashboard;