import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import HRDashboard from "./pages/HRDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import ScheduleInterview from "./pages/ScheduleInterview";
import InterviewRoom from "./pages/InterviewRoom";
import LiveInterviewHistory from "./pages/LiveInterviewHistory";
import InterviewDetails from "./pages/InterviewDetails";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ServerUrl } from "./config";

function App() {

  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()

  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={<InterviewReport/>}/>
      
      {/* Dashboard */}
      <Route path='/dashboard' element={<Dashboard />} />

  {/* live interview routes */}
       <Route path="/hr-dashboard" element={<HRDashboard />} />

      <Route
        path="/candidate-dashboard"
        element={<CandidateDashboard />}
      />

      <Route
        path="/schedule-interview"
        element={<ScheduleInterview />}
      />

      <Route
        path="/interview-room/:id"
        element={<InterviewRoom />}
      />

      {/* Allow opening interview room without id (fallback) to avoid 404 when UI uses /interview-room */}
      <Route
        path="/interview-room"
        element={<InterviewRoom />}
      />

      <Route
        path="/live-history"
        element={<LiveInterviewHistory />}
      />

      <Route
        path="/interview/:id"
        element={<InterviewDetails />}
      />

      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App
