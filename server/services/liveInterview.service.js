import LiveInterview from "../models/liveInterview.model.js";
import User from "../models/user.model.js";
import generateRoomId from "../utils/generateRoomId.js";

const populateFields = [
  { path: "hrId", select: "name email role" },
  { path: "candidateId", select: "name email role" },
];

export const normalizeLiveInterviewPayload = (data = {}) => {
  const candidateId = data.candidateId || data.candidate || null;
  const title = data.jobTitle || data.title || "";
  const description = data.description || "";
  const duration = Number(data.duration || 60);
  const mode = data.mode || "Online";
  const meetingLink = data.meetingLink || "";
  const date = data.date || data.scheduledDate || "";
  const time = data.time || data.scheduledTime || "";

  if (!title) {
    throw new Error("jobTitle is required");
  }

  if (!date || !time) {
    throw new Error("date and time are required");
  }

  const scheduledAt = new Date(`${date}T${time}`);

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error("Invalid scheduled date/time");
  }

  return {
    title,
    description,
    candidateId,
    duration: Number.isFinite(duration) ? duration : 60,
    mode,
    meetingLink,
    scheduledAt,
  };
};

export const createLiveInterview = async (hrId, data) => {
  const payload = normalizeLiveInterviewPayload(data);
  let candidateId = null;

  if (payload.candidateId) {
    const candidate = await User.findById(payload.candidateId);
    if (candidate && candidate.role === "Candidate") {
      candidateId = payload.candidateId;
    }
  }

  const interview = await LiveInterview.create({
    title: payload.title,
    description: payload.description || "",
    interviewType: "LIVE",
    hrId,
    candidateId,
    scheduledAt: payload.scheduledAt,
    duration: payload.duration,
    roomId: generateRoomId(),
    status: "Scheduled",
    meetingLink: payload.meetingLink,
    mode: payload.mode,
  });

  return interview.populate(populateFields);
};

export const getHRInterviews = async (hrId) => {
  return LiveInterview.find({ hrId })
    .populate(populateFields)
    .sort({ scheduledAt: -1 });
};

export const getCandidateInterviews = async (candidateId) => {
  return LiveInterview.find({
    $or: [{ candidateId }, { candidateId: null }],
  })
    .populate(populateFields)
    .sort({ scheduledAt: -1 });
};

export const getInterviewById = async (idOrRoomId) => {
  let interview;

  if (idOrRoomId.match(/^[0-9a-fA-F]{24}$/)) {
    interview = await LiveInterview.findById(idOrRoomId).populate(populateFields);
  }
  if (!interview) {
    interview = await LiveInterview.findOne({ roomId: idOrRoomId }).populate(populateFields);
  }

  if (!interview) {
    throw new Error("Interview not found");
  }

  return interview;
};

export const updateLiveInterview = async (id, hrId, updates) => {
  const interview = await LiveInterview.findOne({ _id: id, hrId });

  if (!interview) {
    throw new Error("Interview not found or access denied");
  }

  if (interview.status === "Completed" || interview.status === "Cancelled") {
    throw new Error("Cannot update a completed or cancelled interview");
  }

  const allowedFields = ["title", "description", "scheduledAt", "duration", "feedback"];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === "scheduledAt") {
        interview.scheduledAt = new Date(updates.scheduledAt);
      } else {
        interview[field] = updates[field];
      }
    }
  });

  if (updates.candidateId) {
    const candidate = await User.findById(updates.candidateId);
    if (!candidate || candidate.role !== "Candidate") {
      throw new Error("Invalid candidate");
    }
    interview.candidateId = updates.candidateId;
  }

  await interview.save();
  return interview.populate(populateFields);
};

export const cancelLiveInterview = async (id, hrId) => {
  const interview = await LiveInterview.findOne({ _id: id, hrId });

  if (!interview) {
    throw new Error("Interview not found or access denied");
  }

  if (interview.status === "Completed") {
    throw new Error("Cannot cancel a completed interview");
  }

  interview.status = "Cancelled";
  await interview.save();
  return interview.populate(populateFields);
};

export const endLiveInterview = async (id, userId) => {
  let interview = await LiveInterview.findById(id);
  if (!interview && id.match(/^[a-zA-Z0-9_-]+$/)) {
    interview = await LiveInterview.findOne({ roomId: id });
  }

  if (!interview) {
    throw new Error("Interview not found");
  }

  interview.status = "Completed";
  await interview.save();
  return interview.populate(populateFields);
};

export const startLiveInterview = async (id) => {
  let interview = await LiveInterview.findById(id);
  if (!interview) {
    interview = await LiveInterview.findOne({ roomId: id });
  }

  if (!interview) {
    throw new Error("Interview not found");
  }

  if (interview.status === "Scheduled") {
    interview.status = "Ongoing";
    await interview.save();
  }

  return interview;
};

export const verifyRoomAccess = async (roomId, userId) => {
  let interview = await LiveInterview.findOne({ roomId });
  if (!interview && roomId.match(/^[0-9a-fA-F]{24}$/)) {
    interview = await LiveInterview.findById(roomId);
  }

  if (!interview) {
    throw new Error("Interview room not found");
  }

  if (interview.status === "Cancelled" || interview.status === "Completed") {
    throw new Error("Interview is no longer active");
  }

  // If room has no candidate assigned yet and the joining user is not HR, assign them
  if (!interview.candidateId && interview.hrId.toString() !== userId) {
    interview.candidateId = userId;
    await interview.save();
  }

  return interview;
};

export const getCandidates = async () => {
  return User.find({ role: "Candidate" }).select("name email role");
};

export const deleteTestData = async () => {
  const deletedInterviews = await LiveInterview.deleteMany({
    title: { $regex: /test|demo|sample/i },
  });

  return {
    deletedInterviews: deletedInterviews.deletedCount || 0,
  };
};
