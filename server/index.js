import express from "express"
import dotenv from "dotenv"
import { createServer } from "http"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import liveInterviewRouter from "./routes/liveInterview.route.js"
import initSocket from "./socket/socket.js"

const app = express()
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://mock-interview-gamma-flax.vercel.app"
  ],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)
app.use("/api/live-interviews", liveInterviewRouter)

// Basic root route to verify server is running
app.get('/', (req, res) => {
  res.send('Server is running')
})

const PORT = process.env.PORT || 5001
const httpServer = createServer(app)

initSocket(httpServer)

httpServer.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})

export { app, httpServer }
