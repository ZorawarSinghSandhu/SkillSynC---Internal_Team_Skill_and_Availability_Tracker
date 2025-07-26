import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/me/skills", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { skills: skills },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Skills updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
