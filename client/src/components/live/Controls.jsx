import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import ScreenShareButton from "./ScreenShareButton";

function Controls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={onToggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {isMuted ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
        </button>

        <button
          onClick={onToggleVideo}
          title={isVideoOff ? "Turn video on" : "Turn video off"}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            isVideoOff ? "bg-red-100 text-red-600" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {isVideoOff ? <FaVideoSlash size={20} /> : <FaVideo size={20} />}
        </button>

        <ScreenShareButton
          isScreenSharing={isScreenSharing}
          onToggle={onToggleScreenShare}
        />

        <button
          onClick={onEndCall}
          title="End call"
          className="w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition"
        >
          <FaPhoneSlash size={20} />
        </button>
      </div>
    </div>
  );
}

export default Controls;
