const express = require("express");
const router = express.Router();
const { getRecommendations, predictProgress, analyzeSentiment, recommendChallenges } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/recommendations", protect, getRecommendations);
router.post("/predict", protect, predictProgress);
router.post("/sentiment", protect, analyzeSentiment);
router.post("/recommend-challenges", protect, recommendChallenges);

module.exports = router;
