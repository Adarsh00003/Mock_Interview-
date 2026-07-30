import mongoose from "mongoose";

const liveInterviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    interviewType: {
      type: String,
      enum: ["AI", "LIVE"],
      default: "LIVE",
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
    },
    mode: {
      type: String,
      default: "Online",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

liveInterviewSchema.index({ hrId: 1, status: 1 });
liveInterviewSchema.index({ candidateId: 1, status: 1 });

const LiveInterview = mongoose.model("LiveInterview", liveInterviewSchema);

export default LiveInterview;
