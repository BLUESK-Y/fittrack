const express = require("express");
const router = express.Router();
const {
  getUserChallenges,
  joinChallenge,
  leaveChallenge,
  completeChallenge,
} = require("../controllers/userChallengeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getUserChallenges);
router.post("/", protect, joinChallenge);
router.put("/complete/:id", protect, completeChallenge);
router.delete("/:id", protect, leaveChallenge);

module.exports = router;
