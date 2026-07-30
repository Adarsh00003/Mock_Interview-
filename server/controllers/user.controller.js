import User from "../models/user.model.js"


export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
         return res.status(500).json({message:`failed to get currentUser ${error}`})
    }
}

export const updateRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !["HR", "Candidate"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be HR or Candidate." });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Failed to update role: ${error.message}` });
    }
}