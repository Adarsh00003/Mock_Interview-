import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaVideo,
} from "react-icons/fa";
import { getCandidateInterviews, getHRInterviews } from "../services/liveInterviewService";

function LiveInterviewHistory() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user?.userData);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const isHr = userData?.role === "HR";
        const response = isHr ? await getHRInterviews() : await getCandidateInterviews();
        setInterviews(response.data || []);
      } catch (err) {
        console.error("Error fetching live interview history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userData?.role]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="bg-white p-3 rounded-full shadow hover:shadow-md"
          >
            <FaArrowLeft />
          </button>

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Live Interview History
            </h1>

            <p className="text-gray-500 mt-1">
              View all scheduled and completed live interviews.
            </p>

          </div>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-3xl font-bold text-blue-600">
              {interviews.length}
            </h2>

            <p className="text-gray-500 mt-2">
              Total Interviews
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-3xl font-bold text-green-600">
              {
                interviews.filter(
                  (i) => i.status === "Completed"
                ).length
              }
            </h2>

            <p className="text-gray-500 mt-2">
              Completed
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-3xl font-bold text-yellow-600">
              {
                interviews.filter(
                  (i) => i.status === "Scheduled" || i.status === "Ongoing"
                ).length
              }
            </h2>

            <p className="text-gray-500 mt-2">
              Upcoming & Live
            </p>

          </div>

        </div>

        {/* Interview List */}

        <div className="space-y-6">

          {loading ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow">
              Loading interview history...
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow">
              No interview records found.
            </div>
          ) : (
            interviews.map((item) => (

              <div
                key={item._id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  <div>

                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 mt-4">

                      <FaUserTie />

                      {userData?.role === "HR"
                        ? `Candidate: ${item.candidateId?.name || "Candidate"}`
                        : `HR: ${item.hrId?.name || "HR Manager"}`}

                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mt-2">

                      <FaCalendarAlt />

                      {new Date(item.scheduledAt).toLocaleDateString()}

                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mt-2">

                      <FaClock />

                      {new Date(item.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mt-2">

                      <FaVideo />

                      {item.mode || "Online"}

                    </div>

                  </div>

                  <div className="flex flex-col items-end justify-between">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium
                      ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Scheduled" || item.status === "Ongoing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="flex gap-3 mt-6">

                      {(item.status === "Scheduled" || item.status === "Ongoing") && (

                        <button
                          onClick={() =>
                            navigate(`/interview-room/${item._id}`)
                          }
                          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                        >
                          Join Room
                        </button>

                      )}

                      <button
                        onClick={() =>
                          navigate(`/interview/${item._id}`)
                        }
                        className="border px-5 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Details
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default LiveInterviewHistory;