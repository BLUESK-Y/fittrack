const express = require("express");
const router = express.Router();
const { createLog, getLogs, updateLog, deleteLog, getProgressReport } = require("../controllers/logController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getLogs);
router.post("/", protect, createLog);
router.put("/:id", protect, updateLog);
router.delete("/:id", protect, deleteLog);
router.get("/report/:challengeId", protect, getProgressReport);

module.exports = router;
