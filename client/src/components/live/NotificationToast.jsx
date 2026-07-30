import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../store/liveInterviewSlice";

function NotificationToast({ notifications }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[notifications.length - 1];
    const timer = setTimeout(() => {
      dispatch(removeNotification(latest.id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  const latest = notifications[notifications.length - 1];

  const bgColor =
    latest.type === "error"
      ? "bg-red-500"
      : latest.type === "interview-ended"
      ? "bg-gray-800"
      : "bg-blue-600";

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-lg max-w-sm`}>
        <p className="font-medium">{latest.message}</p>
      </div>
    </div>
  );
}

export default NotificationToast;
