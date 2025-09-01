const router = require("express").Router();
const {
  createSession,
  addMessage,
  getSessionById,
  getAllSessionsByUser,
  addMultipleMessages,
} = require("../Controller/History");

// Debug middleware
router.use((req, res, next) => {
  console.log(`History Route: ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

router.post("/session", createSession);
router.post("/message", addMessage);
router.post("/messages/bulk", addMultipleMessages); // For syncing multiple messages
router.get("/session/:sessionId", getSessionById);  
router.get("/user/:userId/sessions", getAllSessionsByUser);

module.exports = router;
