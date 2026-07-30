import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import InterviewForm from "../components/InterviewForm";
import { createLiveInterview, getCandidates } from "../services/liveInterviewService";

function ScheduleInterview() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    candidate: "",
    jobTitle: "",
    interviewType: "Technical",
    date: "",
    time: "",
    duration: "60",
    mode: "Online",
    meetingLink: "",
    skills: "",
    description: "",
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await getCandidates();
        setCandidates(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [createdInterview, setCreatedInterview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setCreatedInterview(null);

    try {
      const payload = {
        candidateId: candidates.find((candidate) => candidate.name === formData.candidate)?._id || "",
        jobTitle: formData.jobTitle,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        mode: formData.mode,
        meetingLink: formData.meetingLink,
      };

      const res = await createLiveInterview(payload);
      setCreatedInterview(res.data?.interview);
      setMessage("Interview scheduled successfully!");
      setFormData({
        candidate: "",
        jobTitle: "",
        interviewType: "Technical",
        date: "",
        time: "",
        duration: "60",
        mode: "Online",
        meetingLink: "",
        skills: "",
        description: "",
      });
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to schedule interview.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-5xl mx-auto">

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
              Schedule Interview
            </h1>

            <p className="text-gray-500 mt-1">
              Create a new interview for a candidate.
            </p>
          </div>

        </div>

        {/* Form Card */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {message && (
            <div className="mb-6 rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-800 bg-emerald-50 font-medium">
              {message}
            </div>
          )}

          {createdInterview && (
            <div className="mb-8 rounded-2xl border-2 border-blue-500/30 bg-blue-50/60 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Meeting Code Generated 🎉
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Share this code with the candidate so they can join at the scheduled time:
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-mono text-xl font-extrabold bg-white border border-blue-200 px-4 py-2 rounded-xl text-blue-600 tracking-wider shadow-sm">
                    {createdInterview.roomId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdInterview.roomId);
                      alert("Meeting Code copied to clipboard!");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                  >
                    Copy Code
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate(`/interview-room/${createdInterview.roomId}`)}
                className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl text-sm whitespace-nowrap"
              >
                Join Room Now
              </button>
            </div>
          )}

          <InterviewForm
            candidates={candidates}
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

        </div>

      </div>

    </div>
  );
}

export default ScheduleInterview;