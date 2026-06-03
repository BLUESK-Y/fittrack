const express = require("express");
const router = express.Router();
const {
  getProgressChartData,
  getWeeklySummary,
  getChallengeChartData,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/progress", protect, getProgressChartData);
router.get("/weekly", protect, getWeeklySummary);
router.get("/challenge/:challengeId", protect, getChallengeChartData);

module.exports = router;
