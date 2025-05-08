const express = require("express");
const router = express.Router();
const {
  postMessage,
  getMessagesByDate,
  getEntryHistory,
  handleCommand,
  // getDailySummary, // Assuming this might be part of handleCommand or a separate one
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// All chat routes are protected
router.use(protect);

router.post("/message", postMessage);
router.get("/date/:date", getMessagesByDate);
router.get("/history", getEntryHistory);
router.post("/command", handleCommand);
// router.get('/summary/:date', getDailySummary); // Example if you add a dedicated summary route

module.exports = router;
