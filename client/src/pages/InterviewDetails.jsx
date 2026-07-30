import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaUser,
  FaVideo,
  FaBriefcase,
  FaClipboardList,
} from "react-icons/fa";
import { getInterviewById } from "../services/liveInterviewService";

function InterviewDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await getInterviewById(id);
        setInterview(data);
      } catch (err) {
        console.error("Error fetching interview details:", err);
        setError(err?.response?.data?.message || "Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInterview();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-gray-500 font-medium">Loading interview details...</div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "Invalid interview ID"}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  const dateFormatted = new Date(interview.scheduledAt).toLocaleDateString();
  const timeFormatted = new Date(interview.scheduledAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="bg-white p-3 rounded-full shadow hover:shadow-md transition"
          >
            <FaArrowLeft />
          </button>

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Interview Details
            </h1>

            <p className="text-gray-500 mt-1">
              Complete information about this interview session.
            </p>

          </div>

        </div>

        {/* Top Grid */}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Interview Info */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              Interview Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-3 text-gray-700">
                <FaBriefcase className="text-blue-500" />
                <span className="font-medium">{interview.title}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <FaCalendarAlt className="text-green-500" />
                <span>{dateFormatted}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <FaClock className="text-yellow-500" />
                <span>
                  {timeFormatted} &bull; {interview.duration || 60} Minutes
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <FaVideo className="text-red-500" />
                <span>{interview.mode || "Online"}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <FaClipboardList className="text-purple-500" />
                <span>Status: <strong className="text-gray-900">{interview.status}</strong></span>
              </div>

            </div>

          </div>

          {/* People */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              Participants
            </h2>

            <div className="space-y-6">

              <div>

                <div className="flex items-center gap-3">

                  <FaUserTie className="text-blue-600 text-xl" />

                  <div>

                    <h3 className="font-semibold text-gray-800">
                      HR Interviewer
                    </h3>

                    <p className="text-gray-600">
                      {interview.hrId?.name || "HR Manager"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {interview.hrId?.email}
                    </p>

                  </div>

                </div>

              </div>

              <div>

                <div className="flex items-center gap-3">

                  <FaUser className="text-green-600 text-xl" />

                  <div>

                    <h3 className="font-semibold text-gray-800">
                      Candidate
                    </h3>

                    <p className="text-gray-600">
                      {interview.candidateId?.name || "Candidate"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {interview.candidateId?.email}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Description */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6">

          <h2 className="text-xl font-semibold mb-4">
            Interview Description
          </h2>

          <p className="text-gray-600">
            {interview.description || "No specific instructions provided."}
          </p>

        </div>

        {/* Meeting Link */}

        {interview.meetingLink && (
          <div className="bg-white rounded-2xl shadow mt-6 p-6">

            <h2 className="text-xl font-semibold mb-4">
              Meeting Link
            </h2>

            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline font-medium break-all"
            >
              {interview.meetingLink}
            </a>

          </div>
        )}

        {/* Feedback */}

        {interview.feedback && (
          <div className="bg-white rounded-2xl shadow mt-6 p-6">

            <h2 className="text-xl font-semibold mb-4">
              Interview Notes & Feedback
            </h2>

            <p className="text-gray-600">
              {interview.feedback}
            </p>

          </div>
        )}

        {/* Bottom Actions */}

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 font-medium transition"
          >
            Back
          </button>

          {(interview.status === "Scheduled" || interview.status === "Ongoing") && (
            <button
              onClick={() => navigate(`/interview-room/${interview._id}`)}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition"
            >
              Join Interview Room
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default InterviewDetails;