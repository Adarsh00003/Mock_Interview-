export const canJoinInterview = (interview) => {
  if (!interview) return false;
  if (interview.status === "Cancelled" || interview.status === "Completed") return false;

  const now = Date.now();
  const scheduled = new Date(interview.scheduledAt).getTime();
  const earlyJoinMs = 5 * 60 * 1000;
  const endTime = scheduled + interview.duration * 60 * 1000;

  return now >= scheduled - earlyJoinMs && now <= endTime;
};

export const formatInterviewDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatInterviewTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Ongoing":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};
