import { FaVideo, FaSpinner } from "react-icons/fa";

function WaitingRoom({ title, waitingFor, onReady, isReady, participantCount }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl shadow p-8">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <FaVideo className="text-3xl text-gray-400" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        {participantCount >= 2
          ? "Both participants are connected. Starting video call..."
          : `Waiting for ${waitingFor} to join...`}
      </p>

      {!isReady ? (
        <button
          onClick={onReady}
          className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Enable Camera & Microphone
        </button>
      ) : participantCount < 2 ? (
        <div className="flex items-center gap-3 text-gray-500">
          <FaSpinner className="animate-spin" />
          <span>Waiting for other participant...</span>
        </div>
      ) : null}
    </div>
  );
}

export default WaitingRoom;
