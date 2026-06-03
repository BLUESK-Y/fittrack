const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", protect, updateUser);

module.exports = router;
