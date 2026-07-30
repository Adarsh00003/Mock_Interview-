import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaComments,
  FaRegStickyNote,
  FaDesktop,
  FaUser,
  FaClock,
  FaPaperPlane,
  FaInfoCircle,
} from "react-icons/fa";
import { getInterviewById, endLiveInterview } from "../services/liveInterviewService";
import useWebRTC from "../hooks/useWebRTC";
import useInterviewSocket from "../hooks/useInterviewSocket";

function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user?.userData);
  const chatMessages = useSelector((state) => state.liveInterview?.chatMessages || []);
  const isTyping = useSelector((state) => state.liveInterview?.isTyping || false);
  const remainingMs = useSelector((state) => state.liveInterview?.remainingMs);

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setLoading(false);
        setError("Interview ID is missing.");
        return;
      }
      try {
        const { data } = await getInterviewById(id);
        setInterview(data);

        if (userData?._id) {
          const isHr = data.hrId?._id === userData._id;
          setRemoteUser(isHr ? data.candidateId : data.hrId);
        }
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load interview room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, userData?._id]);

  const roomId = interview?.roomId || id;
  const interviewId = interview?._id || id;
  const userId = userData?._id;
  const remoteUserId = remoteUser?._id;

  const {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    startLocalStream,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    cleanup: cleanupWebRTC,
  } = useWebRTC(roomId, userId, remoteUserId);

  const { sendMessage, sendTyping, endInterview: socketEndInterview } = useInterviewSocket({
    roomId,
    interviewId,
    userId,
    onUserJoined: (data) => {
      console.log("User joined room:", data);
      if (!data.self && data.userId !== userId) {
        setRemoteUser(data.user);
        createOffer();
      }
    },
    onUserLeft: (data) => {
      console.log("User left room:", data);
    },
    onOffer: (offer, fromUserId) => {
      handleOffer(offer, fromUserId);
    },
    onAnswer: (answer) => {
      handleAnswer(answer);
    },
    onIceCandidate: (candidate) => {
      handleIceCandidate(candidate);
    },
    onEndInterview: (data) => {
      cleanupWebRTC();
      alert(data?.message || "Interview has ended.");
      navigate(userData?.role === "HR" ? "/hr-dashboard" : "/candidate-dashboard");
    },
  });

  useEffect(() => {
    if (roomId && userId) {
      startLocalStream().catch((err) => {
        console.error("Camera/Mic access error:", err);
      });
    }
  }, [roomId, userId, startLocalStream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(messageText.trim());
    setMessageText("");
    sendTyping(false);
  };

  const handleTypingChange = (e) => {
    setMessageText(e.target.value);
    sendTyping(e.target.value.length > 0);
  };

  const handleLeaveOrEndCall = async () => {
    if (window.confirm("Are you sure you want to end this interview call?")) {
      try {
        if (userData?.role === "HR" && interviewId) {
          await endLiveInterview(interviewId);
        }
      } catch (err) {
        console.error("End interview error:", err);
      } finally {
        socketEndInterview();
        cleanupWebRTC();
        navigate(userData?.role === "HR" ? "/hr-dashboard" : "/candidate-dashboard");
      }
    }
  };

  const formatTimer = (ms) => {
    if (ms === null || ms === undefined || ms < 0) return "--:--";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-medium">Entering Live Interview Room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <FaInfoCircle className="text-red-400 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Unable to Join Room</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isHr = userData?.role === "HR";
  const hrName = isHr ? userData?.name : remoteUser?.name || interview?.hrId?.name || "HR Manager";
  const candidateName = !isHr ? userData?.name : remoteUser?.name || interview?.candidateId?.name || "Candidate";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 border border-blue-500/30 text-blue-400 p-2.5 rounded-xl">
            <FaVideo className="text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-wide">
              {interview?.title || "Live Interview Session"}
            </h1>
            <p className="text-xs text-slate-400">
              HR: <span className="text-slate-200">{hrName}</span> &bull; Candidate:{" "}
              <span className="text-slate-200">{candidateName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-4 py-2 rounded-xl text-sm">
            <FaClock className="text-amber-400 animate-pulse text-xs" />
            <span className="font-mono text-slate-200 font-semibold">
              {formatTimer(remainingMs)}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden relative">
        <div className="flex-1 flex flex-col gap-4 relative">
          <div className="flex-1 grid md:grid-cols-2 gap-4 h-full min-h-[420px]">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl group">
              <div className="absolute top-4 left-4 z-10 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                You ({userData?.role || "Participant"})
              </div>

              <div className="w-full h-full flex items-center justify-center relative bg-slate-950">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${
                    isVideoOff ? "hidden" : "block"
                  }`}
                />

                {isVideoOff && (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-4xl text-slate-300 mb-3 shadow-inner">
                      {userData?.name?.charAt(0)?.toUpperCase() || <FaUser />}
                    </div>
                    <p className="text-sm font-medium text-slate-400">{userData?.name || "You"}</p>
                    <span className="text-xs text-slate-600 mt-1">Camera Off</span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                {isMuted && (
                  <span className="bg-red-500/90 text-white p-2 rounded-lg text-xs flex items-center gap-1 shadow">
                    <FaMicrophoneSlash /> Muted
                  </span>
                )}
                {isScreenSharing && (
                  <span className="bg-blue-500/90 text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shadow">
                    <FaDesktop /> Screen Sharing
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl group">
              <div className="absolute top-4 left-4 z-10 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {remoteUser?.name || (isHr ? "Candidate" : "HR Interviewer")}
              </div>

              <div className="w-full h-full flex items-center justify-center relative bg-slate-950">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${remoteStream ? "block" : "hidden"}`}
                />

                {!remoteStream && (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-4xl text-slate-300 mb-3 shadow-inner">
                      {remoteUser?.name?.charAt(0)?.toUpperCase() || <FaUser />}
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      {remoteUser?.name || (isHr ? "Waiting for Candidate to join..." : "Waiting for HR to join...")}
                    </p>
                    <span className="text-xs text-slate-500 mt-1">Connecting WebRTC video stream...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-center gap-4 shadow-xl">
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isMuted
                  ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                  : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
              }`}
            >
              {isMuted ? <FaMicrophoneSlash size={18} /> : <FaMicrophone size={18} />}
            </button>

            <button
              onClick={toggleVideo}
              title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isVideoOff
                  ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                  : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
              }`}
            >
              {isVideoOff ? <FaVideoSlash size={18} /> : <FaVideo size={18} />}
            </button>

            <button
              onClick={toggleScreenShare}
              title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isScreenSharing
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
              }`}
            >
              <FaDesktop size={18} />
            </button>

            <div className="w-px h-8 bg-slate-800 mx-2"></div>

            <button
              onClick={handleLeaveOrEndCall}
              title="End Call"
              className="bg-red-600 hover:bg-red-700 text-white px-6 h-12 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-red-600/30 transition-all"
            >
              <FaPhoneSlash size={16} />
              <span>End Call</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-96 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800 bg-slate-950/50">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === "chat"
                  ? "border-blue-500 text-blue-400 bg-slate-900/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaComments /> Chat
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === "notes"
                  ? "border-blue-500 text-blue-400 bg-slate-900/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaRegStickyNote /> Notes
            </button>
          </div>

          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                    <FaComments className="text-3xl mb-2 text-slate-700" />
                    <p className="text-xs">No messages yet.</p>
                    <p className="text-[11px] text-slate-600 mt-1">Start chatting with the candidate or HR here.</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => {
                    const isSelf = msg.userId === userId;
                    return (
                      <div
                        key={index}
                        className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-1 px-1">
                          {msg.userName || "User"}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow ${
                            isSelf
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 px-1">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {isTyping && (
                <div className="px-4 py-1 text-xs text-blue-400 italic bg-slate-950/30 border-t border-slate-800/40">
                  Other participant is typing...
                </div>
              )}

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/60 flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTypingChange}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-xl flex items-center justify-center transition"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="flex-1 flex flex-col p-4 bg-slate-950/30">
              <label className="text-xs font-medium text-slate-400 mb-2">
                Interview Observations & Notes (Private)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during the live interview session..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewRoom;