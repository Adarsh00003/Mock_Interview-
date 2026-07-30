import React from "react";

function InterviewForm({
  candidates,
  formData,
  handleChange,
  setFormData,
  handleSubmit,
  isSubmitting,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Candidate */}

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Candidate <span className="text-sm font-normal text-gray-500">(Optional — Anyone with Meeting Code can join)</span>
        </label>

        <select
          name="candidate"
          value={formData.candidate}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Any Candidate with Meeting Code (Open)</option>

          {candidates.map((candidate) => (
            <option key={candidate._id} value={candidate.name}>
              {candidate.name} ({candidate.email})
            </option>
          ))}
        </select>
      </div>

      {/* Job Title */}

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Job Title
        </label>

        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Frontend Developer"
          required
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Interview Type */}

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Interview Type
        </label>

        <select
          name="interviewType"
          value={formData.interviewType}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
        >
          <option>Technical</option>
          <option>HR</option>
          <option>Managerial</option>
          <option>Final Round</option>
        </select>
      </div>

      {/* Date Time */}

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Time
          </label>

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Duration (Minutes)
          </label>

          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          >
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
            <option value="90">90 Minutes</option>
            <option value="120">120 Minutes</option>
          </select>
        </div>

      </div>

      {/* Mode */}

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Interview Mode
        </label>

        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
        >
          <option>Online</option>
          <option>Offline</option>
        </select>
      </div>

      {/* Meeting Link */}

      {formData.mode === "Online" && (

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Meeting Link
          </label>

          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

      )}

      {/* Skills */}

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Required Skills
        </label>

        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Description */}

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Interview Description
        </label>

        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write interview instructions..."
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-4">

        <button
          type="button"
          className="px-6 py-3 border rounded-xl hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-60"
        >
          {isSubmitting ? "Scheduling..." : "Schedule Interview"}
        </button>

      </div>

    </form>
  );
}

export default InterviewForm;