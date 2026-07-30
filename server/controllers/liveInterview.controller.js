import * as liveInterviewService from "../services/liveInterview.service.js";

export const createLiveInterview = async (req, res) => {
  try {
    const interview = await liveInterviewService.createLiveInterview(req.userId, req.body);

    return res.status(201).json({
      message: "Live interview scheduled successfully",
      interview,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getHRInterviews = async (req, res) => {
  try {
    const interviews = await liveInterviewService.getHRInterviews(req.userId);
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCandidateInterviews = async (req, res) => {
  try {
    const interviews = await liveInterviewService.getCandidateInterviews(req.userId);
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await liveInterviewService.getInterviewById(req.params.id);

    const isHr = interview.hrId._id.toString() === req.userId;
    const isAssignedCandidate = interview.candidateId?._id?.toString() === req.userId;
    const isOpenMeeting = !interview.candidateId;

    if (!isHr && !isAssignedCandidate && !isOpenMeeting) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(interview);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateLiveInterview = async (req, res) => {
  try {
    const interview = await liveInterviewService.updateLiveInterview(
      req.params.id,
      req.userId,
      req.body
    );

    return res.status(200).json({
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const cancelLiveInterview = async (req, res) => {
  try {
    const interview = await liveInterviewService.cancelLiveInterview(req.params.id, req.userId);

    return res.status(200).json({
      message: "Interview cancelled successfully",
      interview,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const endLiveInterview = async (req, res) => {
  try {
    const interview = await liveInterviewService.endLiveInterview(req.params.id, req.userId);

    return res.status(200).json({
      message: "Interview ended successfully",
      interview,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const candidates = await liveInterviewService.getCandidates();
    return res.status(200).json(candidates);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTestData = async (req, res) => {
  try {
    const result = await liveInterviewService.deleteTestData();
    return res.status(200).json({ message: "Test data removed", result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
