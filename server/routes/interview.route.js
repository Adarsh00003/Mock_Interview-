import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { analyzeResume, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js"

const interviewRouter = express.Router()

// Multer error handler middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof express.multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File too large. Maximum size is 5MB" });
        }
        return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
}

interviewRouter.post("/resume", isAuth, upload.single("resume"), handleUploadError, analyzeResume)
interviewRouter.post("/generate-questions", isAuth, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, submitAnswer)
interviewRouter.post("/finish", isAuth, finishInterview)

interviewRouter.get("/get-interview", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)

export default interviewRouter
