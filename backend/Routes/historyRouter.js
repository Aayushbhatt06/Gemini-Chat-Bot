const router = require("express").Router();
const {
  createSession,
  addMessage,
  getSessionById,
  getAllSessionsByUser,
} = require("../Controller/HistoryController");

// Create new chat session
router.post("/session", createSession);

// Add message to session
router.post("/message", addMessage);

// Get single session
router.get("/session/:sessionId", getSessionById);

// Get all sessions for a user
router.get("/user/:userId/sessions", getAllSessionsByUser);

module.exports = router;
