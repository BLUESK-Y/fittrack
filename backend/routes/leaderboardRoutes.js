const express = require("express");
const router = express.Router();
const {
  getGlobalLeaderboard,
  getChallengeLeaderboard,
  getScoreLeaderboard,
} = require("../controllers/leaderboardController");

router.get("/", getGlobalLeaderboard);
router.get("/scores", getScoreLeaderboard);
router.get("/challenge/:id", getChallengeLeaderboard);

module.exports = router;
