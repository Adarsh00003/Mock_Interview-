import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, updateRole } from "../controllers/user.controller.js"


const userRouter = express.Router()

userRouter.get("/current-user",isAuth,getCurrentUser)
userRouter.patch("/role", isAuth, updateRole)

export default userRouter