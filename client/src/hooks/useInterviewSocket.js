import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
  SOCKET_EVENTS,
} from "../socket/socketClient";
import {
  addChatMessage,
  addNotification,
  addParticipant,
  removeParticipant,
  setTyping,
  setRemainingMs,
  clearChatMessages,
  resetLiveInterviewState,
} from "../store/liveInterviewSlice";

export const useInterviewSocket = ({
  roomId,
  interviewId,
  userId,
  onUserJoined,
  onUserLeft,
  onOffer,
  onAnswer,
  onIceCandidate,
  onEndInterview,
}) => {
  const dispatch = useDispatch();

  const joinRoom = useCallback(() => {
    const socket = connectSocket();
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, interviewId });
  }, [roomId, interviewId]);

  const leaveRoom = useCallback(() => {
    const socket = connectSocket();
    socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId });
  }, [roomId]);

  const sendMessage = useCallback(
    (message) => {
      const socket = connectSocket();
      socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, { roomId, message });
    },
    [roomId]
  );

  const sendTyping = useCallback(
    (isTyping) => {
      const socket = connectSocket();
      socket.emit(SOCKET_EVENTS.TYPING, { roomId, isTyping });
    },
    [roomId]
  );

  const endInterview = useCallback(() => {
    const socket = connectSocket();
    socket.emit(SOCKET_EVENTS.END_INTERVIEW, { roomId, interviewId });
  }, [roomId, interviewId]);

  useEffect(() => {
    if (!roomId) return;

    const socket = connectSocket();

    socket.on(SOCKET_EVENTS.USER_JOINED, (data) => {
      if (!data.self) {
        dispatch(addParticipant(data));
      }
      dispatch(
        addNotification({
          type: "user-joined",
          message: `${data.user?.name || "User"} joined`,
        })
      );
      onUserJoined?.(data);
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, (data) => {
      dispatch(removeParticipant(data));
      dispatch(
        addNotification({
          type: "user-left",
          message: `${data.user?.name || "User"} left`,
        })
      );
      onUserLeft?.(data);
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (data) => {
      dispatch(addChatMessage(data));
    });

    socket.on(SOCKET_EVENTS.TYPING, (data) => {
      if (data.userId !== userId) {
        dispatch(setTyping({ isTyping: data.isTyping, userId: data.userId }));
      }
    });

    socket.on(SOCKET_EVENTS.OFFER, (data) => {
      if (data.fromUserId !== userId) {
        onOffer?.(data.offer, data.fromUserId);
      }
    });

    socket.on(SOCKET_EVENTS.ANSWER, (data) => {
      if (data.fromUserId !== userId) {
        onAnswer?.(data.answer);
      }
    });

    socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data) => {
      if (data.fromUserId !== userId) {
        onIceCandidate?.(data.candidate);
      }
    });

    socket.on(SOCKET_EVENTS.TIMER_SYNC, (data) => {
      dispatch(setRemainingMs(data.remainingMs));
    });

    socket.on(SOCKET_EVENTS.TIMER_END, () => {
      onEndInterview?.({ autoEnded: true });
    });

    socket.on(SOCKET_EVENTS.END_INTERVIEW, (data) => {
      onEndInterview?.(data);
    });

    socket.on(SOCKET_EVENTS.NOTIFICATION, (data) => {
      dispatch(addNotification(data));
    });

    joinRoom();

    return () => {
      leaveRoom();
      dispatch(clearChatMessages());
      dispatch(resetLiveInterviewState());
      socket.off(SOCKET_EVENTS.USER_JOINED);
      socket.off(SOCKET_EVENTS.USER_LEFT);
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE);
      socket.off(SOCKET_EVENTS.TYPING);
      socket.off(SOCKET_EVENTS.OFFER);
      socket.off(SOCKET_EVENTS.ANSWER);
      socket.off(SOCKET_EVENTS.ICE_CANDIDATE);
      socket.off(SOCKET_EVENTS.TIMER_SYNC);
      socket.off(SOCKET_EVENTS.TIMER_END);
      socket.off(SOCKET_EVENTS.END_INTERVIEW);
      socket.off(SOCKET_EVENTS.NOTIFICATION);
    };
  }, [
    roomId,
    interviewId,
    userId,
    dispatch,
    joinRoom,
    leaveRoom,
    onUserJoined,
    onUserLeft,
    onOffer,
    onAnswer,
    onIceCandidate,
    onEndInterview,
  ]);

  return { sendMessage, sendTyping, endInterview, leaveRoom };
};

export default useInterviewSocket;
