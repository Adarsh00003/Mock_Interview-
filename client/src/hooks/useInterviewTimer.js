import { useMemo } from "react";
import { useSelector } from "react-redux";

const formatTime = (ms) => {
  if (ms === null || ms === undefined) return "--:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const useInterviewTimer = () => {
  const remainingMs = useSelector((state) => state.liveInterview.remainingMs);

  const formattedTime = useMemo(() => formatTime(remainingMs), [remainingMs]);
  const isExpired = remainingMs !== null && remainingMs <= 0;
  const isLowTime = remainingMs !== null && remainingMs <= 5 * 60 * 1000;

  return { remainingMs, formattedTime, isExpired, isLowTime };
};

export default useInterviewTimer;
