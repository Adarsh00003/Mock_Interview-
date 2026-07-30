import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        
        console.log("Auth check - Token from cookies:", token ? "Present" : "Missing");
        console.log("All cookies:", req.cookies);

        if (!token) {
            return res.status(401).json({ message: "User does not have a token. Please login first." })
        }
        
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!verifyToken) {
            return res.status(401).json({ message: "User does not have a valid token" })
        }
        
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ message: `Authentication error: ${error.message}` })
    }
}

export default isAuth