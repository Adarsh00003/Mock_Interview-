import User from "../models/user.model.js";
import * as liveInterviewService from "../services/liveInterview.service.js";
import { SOCKET_EVENTS } from "./events.js";

const roomParticipants = new Map();
const roomTimers = new Map();

const getParticipantInfo = async (userId) => {
  const user = await User.findById(userId).select("name email role");
  return user;
};

const getRoomParticipantCount = (roomId) => {
  return roomParticipants.get(roomId)?.size || 0;
};

const startRoomTimer = (io, roomId, interview) => {
  if (roomTimers.has(roomId)) return;

  const endTime = new Date(interview.scheduledAt).getTime() + interview.duration * 60 * 1000;

  const interval = setInterval(async () => {
    const remaining = Math.max(0, endTime - Date.now());

    io.to(roomId).emit(SOCKET_EVENTS.TIMER_SYNC, {
      remainingMs: remaining,
      endTime,
    });

    if (remaining <= 0) {
      clearInterval(interval);
      roomTimers.delete(roomId);

      try {
        await liveInterviewService.endLiveInterview(interview._id.toString(), interview.hrId.toString());
      } catch {
        // Interview may already be ended
      }

      io.to(roomId).emit(SOCKET_EVENTS.TIMER_END, { roomId });
      io.to(roomId).emit(SOCKET_EVENTS.END_INTERVIEW, {
        message: "Interview time has ended",
        autoEnded: true,
      });
      io.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION, {
        type: "interview-ended",
        message: "Interview ended — time limit reached",
      });
    }
  }, 1000);

  roomTimers.set(roomId, interval);
};

const stopRoomTimer = (roomId) => {
  const timer = roomTimers.get(roomId);
  if (timer) {
    clearInterval(timer);
    roomTimers.delete(roomId);
  }
};

const registerInterviewHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomId, interviewId }) => {
    try {
      const interview = await liveInterviewService.verifyRoomAccess(roomId, socket.userId);

      if (interviewId && interview._id.toString() !== interviewId) {
        socket.emit(SOCKET_EVENTS.NOTIFICATION, {
          type: "error",
          message: "Invalid interview for this room",
        });
        return;
      }

      await liveInterviewService.startLiveInterview(interview._id.toString());

      socket.join(roomId);
      socket.roomId = roomId;
      socket.interviewId = interview._id.toString();

      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Set());
      }
      roomParticipants.get(roomId).add(socket.userId);

      const user = await getParticipantInfo(socket.userId);

      socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        userId: socket.userId,
        user,
        participantCount: getRoomParticipantCount(roomId),
      });

      socket.emit(SOCKET_EVENTS.USER_JOINED, {
        userId: socket.userId,
        user,
        participantCount: getRoomParticipantCount(roomId),
        self: true,
      });

      io.to(roomId).emit(SOCKET_EVENTS.NOTIFICATION, {
        type: "user-joined",
        message: `${user.name} joined the interview`,
        userId: socket.userId,
      });

      if (getRoomParticipantCount(roomId) >= 2) {
        startRoomTimer(io, roomId, interview);
      }

      const endTime = new Date(interview.scheduledAt).getTime() + interview.duration * 60 * 1000;
      socket.emit(SOCKET_EVENTS.TIMER_SYNC, {
        remainingMs: Math.max(0, endTime - Date.now()),
        endTime,
      });
    } catch (error) {
      socket.emit(SOCKET_EVENTS.NOTIFICATION, {
        type: "error",
        message: error.message,
      });
    }
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, async ({ roomId }) => {
    const activeRoom = roomId || socket.roomId;
    if (!activeRoom) return;

    socket.leave(activeRoom);

    if (roomParticipants.has(activeRoom)) {
      roomParticipants.get(activeRoom).delete(socket.userId);
      if (roomParticipants.get(activeRoom).size === 0) {
        roomParticipants.delete(activeRoom);
        stopRoomTimer(activeRoom);
      }
    }

    const user = await getParticipantInfo(socket.userId);

    socket.to(activeRoom).emit(SOCKET_EVENTS.USER_LEFT, {
      userId: socket.userId,
      user,
      participantCount: getRoomParticipantCount(activeRoom),
    });

    io.to(activeRoom).emit(SOCKET_EVENTS.NOTIFICATION, {
      type: "user-left",
      message: `${user?.name || "User"} left the interview`,
      userId: socket.userId,
    });

    socket.roomId = null;
    socket.interviewId = null;
  });

  socket.on(SOCKET_EVENTS.OFFER, ({ roomId, offer, targetUserId }) => {
    socket.to(roomId).emit(SOCKET_EVENTS.OFFER, {
      offer,
      fromUserId: socket.userId,
      targetUserId,
    });
  });

  socket.on(SOCKET_EVENTS.ANSWER, ({ roomId, answer, targetUserId }) => {
    socket.to(roomId).emit(SOCKET_EVENTS.ANSWER, {
      answer,
      fromUserId: socket.userId,
      targetUserId,
    });
  });

  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, ({ roomId, candidate, targetUserId }) => {
    socket.to(roomId).emit(SOCKET_EVENTS.ICE_CANDIDATE, {
      candidate,
      fromUserId: socket.userId,
      targetUserId,
    });
  });

  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async ({ roomId, message }) => {
    if (!message?.trim()) return;

    const user = await getParticipantInfo(socket.userId);

    io.to(roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      userId: socket.userId,
      userName: user?.name || "Unknown",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });
  });

  socket.on(SOCKET_EVENTS.TYPING, ({ roomId, isTyping }) => {
    socket.to(roomId).emit(SOCKET_EVENTS.TYPING, {
      userId: socket.userId,
      isTyping,
    });
  });

  socket.on(SOCKET_EVENTS.END_INTERVIEW, async ({ roomId, interviewId }) => {
    try {
      const activeRoom = roomId || socket.roomId;
      const activeInterviewId = interviewId || socket.interviewId;

      if (activeInterviewId) {
        await liveInterviewService.endLiveInterview(activeInterviewId, socket.userId);
      }

      stopRoomTimer(activeRoom);

      io.to(activeRoom).emit(SOCKET_EVENTS.END_INTERVIEW, {
        message: "Interview has ended",
        endedBy: socket.userId,
      });

      io.to(activeRoom).emit(SOCKET_EVENTS.NOTIFICATION, {
        type: "interview-ended",
        message: "Interview has ended",
      });

      roomParticipants.delete(activeRoom);
    } catch (error) {
      socket.emit(SOCKET_EVENTS.NOTIFICATION, {
        type: "error",
        message: error.message,
      });
    }
  });
};

export default registerInterviewHandlers;
