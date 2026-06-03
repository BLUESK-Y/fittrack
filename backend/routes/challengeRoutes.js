const express = require("express");
const router = express.Router();
const {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challengeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllChallenges);
router.get("/:id", getChallengeById);
router.post("/", protect, authorize("admin"), createChallenge);
router.put("/:id", protect, authorize("admin"), updateChallenge);
router.delete("/:id", protect, authorize("admin"), deleteChallenge);

module.exports = router;
