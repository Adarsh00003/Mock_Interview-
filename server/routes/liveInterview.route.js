import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isHR from "../middlewares/isHR.js";
import {
  createLiveInterview,
  getHRInterviews,
  getCandidateInterviews,
  getInterviewById,
  updateLiveInterview,
  cancelLiveInterview,
  endLiveInterview,
  getCandidates,
  deleteTestData,
} from "../controllers/liveInterview.controller.js";

const liveInterviewRouter = express.Router();

liveInterviewRouter.post("/", isAuth, isHR, createLiveInterview);
liveInterviewRouter.get("/hr", isAuth, isHR, getHRInterviews);
liveInterviewRouter.get("/candidate", isAuth, getCandidateInterviews);
liveInterviewRouter.get("/candidates", isAuth, isHR, getCandidates);
liveInterviewRouter.delete("/cleanup/test-data", isAuth, isHR, deleteTestData);
liveInterviewRouter.get("/:id", isAuth, getInterviewById);
liveInterviewRouter.put("/:id", isAuth, isHR, updateLiveInterview);
liveInterviewRouter.delete("/:id", isAuth, isHR, cancelLiveInterview);
liveInterviewRouter.post("/:id/end", isAuth, endLiveInterview);

export default liveInterviewRouter;
