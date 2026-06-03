const express = require("express");
const router = express.Router();
const { getAllBadges, getUserBadges, checkAndAwardBadgesRoute } = require("../controllers/badgeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllBadges);
router.get("/user/:userId", protect, getUserBadges);
router.post("/check/:userId", protect, checkAndAwardBadgesRoute);

module.exports = router;
