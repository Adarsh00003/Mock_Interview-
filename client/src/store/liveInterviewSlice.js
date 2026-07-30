import { createSlice } from "@reduxjs/toolkit";

const liveInterviewSlice = createSlice({
  name: "liveInterview",
  initialState: {
    interviews: [],
    currentInterview: null,
    candidates: [],
    chatMessages: [],
    participants: [],
    notifications: [],
    isTyping: false,
    typingUserId: null,
    remainingMs: null,
    loading: false,
    error: null,
  },
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    setCurrentInterview: (state, action) => {
      state.currentInterview = action.payload;
    },
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    addParticipant: (state, action) => {
      const exists = state.participants.find((p) => p.userId === action.payload.userId);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(
        (p) => p.userId !== action.payload.userId
      );
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload.isTyping;
      state.typingUserId = action.payload.userId;
    },
    setRemainingMs: (state, action) => {
      state.remainingMs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetLiveInterviewState: (state) => {
      state.currentInterview = null;
      state.chatMessages = [];
      state.participants = [];
      state.isTyping = false;
      state.typingUserId = null;
      state.remainingMs = null;
    },
  },
});

export const {
  setInterviews,
  setCurrentInterview,
  setCandidates,
  addChatMessage,
  clearChatMessages,
  setParticipants,
  addParticipant,
  removeParticipant,
  addNotification,
  removeNotification,
  clearNotifications,
  setTyping,
  setRemainingMs,
  setLoading,
  setError,
  resetLiveInterviewState,
} = liveInterviewSlice.actions;

export default liveInterviewSlice.reducer;
