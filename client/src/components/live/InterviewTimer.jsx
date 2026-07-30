import { FaClock } from "react-icons/fa";
import useInterviewTimer from "../../hooks/useInterviewTimer";

function InterviewTimer() {
  const { formattedTime, isLowTime, isExpired } = useInterviewTimer();

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-semibold ${
        isExpired
          ? "bg-red-100 text-red-700"
          : isLowTime
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      <FaClock />
      <span>{isExpired ? "00:00" : formattedTime}</span>
    </div>
  );
}

export default InterviewTimer;
