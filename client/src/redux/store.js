import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import liveInterviewSlice from "../store/liveInterviewSlice"

export default configureStore({
  reducer: {
    user: userSlice,
    liveInterview: liveInterviewSlice,
  },
})