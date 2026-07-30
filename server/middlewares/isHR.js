import User from "../models/user.model.js";

const isHR = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "HR") {
      return res.status(403).json({ message: "Access denied. HR role required." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: `Authorization error: ${error.message}` });
  }
};

export default isHR;
