import { FaDesktop } from "react-icons/fa";

function ScreenShareButton({ isScreenSharing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isScreenSharing ? "Stop sharing" : "Share screen"}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
        isScreenSharing
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      <FaDesktop size={20} />
    </button>
  );
}

export default ScreenShareButton;
