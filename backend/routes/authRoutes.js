const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

// TEMPORARY — remove after first use
router.get("/reset-admin-once", async (req, res) => {
  const hashed = await bcrypt.hash("Admin@123", 10);
  const result = await mongoose.connection.collection("users").updateOne(
    { email: "nandanamanoj2020@gmail.com" },
    { $set: { name: "Nandana Manoj", email: "nandanamanoj2020@gmail.com", password: hashed, role: "admin", totalPoints: 0, currentStreak: 0, longestStreak: 0, score: 0 }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  res.json({ matched: result.matchedCount, modified: result.modifiedCount, upserted: result.upsertedCount });
});

module.exports = router;
