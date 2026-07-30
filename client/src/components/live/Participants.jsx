import { FaUser, FaUserTie } from "react-icons/fa";

function Participants({ hr, candidate, participants = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="font-semibold mb-4">Participants</h2>
      <div className="space-y-3">
        {hr && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <FaUserTie className="text-blue-600" />
            <div>
              <p className="font-medium">{hr.name}</p>
              <p className="text-xs text-gray-500">HR</p>
            </div>
            <span
              className={`ml-auto w-2 h-2 rounded-full ${
                participants.some((p) => p.userId === hr._id) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
        )}
        {candidate && (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <FaUser className="text-green-600" />
            <div>
              <p className="font-medium">{candidate.name}</p>
              <p className="text-xs text-gray-500">Candidate</p>
            </div>
            <span
              className={`ml-auto w-2 h-2 rounded-full ${
                participants.some((p) => p.userId === candidate._id) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {participants.length} of 2 connected
      </p>
    </div>
  );
}

export default Participants;
