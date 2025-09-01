// controllers/historyController.js
const historyModel = require("../Models/History");
const mongoose = require("mongoose");

/**
 * Create a new session for a user
 */
const createSession = async (req, res) => {
  const { userId, sessionName = "New Session" } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }

  try {
    // check if user already has a history doc
    let historyDoc = await historyModel.findOne({ userId });

    if (!historyDoc) {
      // create a new history document for this user
      historyDoc = new historyModel({
        userId,
        sessions: [{ sessionName, messages: [] }],
      });
    } else {
      // push new session to existing history doc
      historyDoc.sessions.push({ sessionName, messages: [] });
    }

    await historyDoc.save();

    // return the newly created session (last in the array)
    const newSession = historyDoc.sessions[historyDoc.sessions.length - 1];

    res.status(201).json({
      success: true,
      session: newSession,
    });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({
      success: false,
      message: "Server error creating session",
      error: err.message,
    });
  }
};

/**
 * Add a message to a specific session
 */
const addMessage = async (req, res) => {
  const { userId, sessionId, message } = req.body;

  if (!userId || !sessionId || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing userId, sessionId, or message",
    });
  }

  try {
    const historyDoc = await historyModel.findOneAndUpdate(
      { userId, "sessions._id": sessionId },
      {
        $push: { "sessions.$.messages": message },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!historyDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const updatedSession = historyDoc.sessions.id(sessionId);

    res.status(200).json({
      success: true,
      session: updatedSession,
    });
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({
      success: false,
      message: "Server error adding message",
      error: err.message,
    });
  }
};

/**
 * Get a specific session by ID
 */
// const getSessionById = async (req, res) => {
//   const { sessionId } = req.params;
//   const { userId} = req.query;

//   if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid sessionId format" });
//   }

//   try {
//     const historyDoc = await historyModel.findOne({ userId });
//     if (!historyDoc) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const session = historyDoc.sessions.id(sessionId);
//     if (!session) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Session not found" });
//     }

//     res.status(200).json({ success: true, session });
//   } catch (err) {
//     console.error("Error fetching session:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error fetching session",
//       error: err.message,
//     });
//   }
// };
const getSessionById = async (req, res) => {
  const { sessionId } = req.params;
  const { userId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid sessionId format" });
  }

  try {
    // Find the user document by userId
    const historyDoc = await historyModel.findOne({ userId });

    if (!historyDoc) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Now find the session inside the sessions array
    const session = historyDoc.sessions.id(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching session",
      error: err.message,
    });
  }
};

/**
 * Get all sessions for a user
 */
const getAllSessionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const historyDoc = await historyModel
      .findOne({ userId })
      .select("sessions");
    if (!historyDoc) {
      return res.status(200).json({ success: true, sessions: [], count: 0 });
    }

    res.status(200).json({
      success: true,
      sessions: historyDoc.sessions,
      count: historyDoc.sessions.length,
    });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching sessions",
      error: err.message,
    });
  }
};

/**
 * Add multiple messages to a session
 */
const addMultipleMessages = async (req, res) => {
  const { userId, sessionId, messages } = req.body;

  if (!userId || !sessionId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: "Missing userId, sessionId, or messages array",
    });
  }

  try {
    const historyDoc = await historyModel.findOneAndUpdate(
      { userId, "sessions._id": sessionId },
      {
        $push: { "sessions.$.messages": { $each: messages } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!historyDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const updatedSession = historyDoc.sessions.id(sessionId);

    res.status(200).json({
      success: true,
      session: updatedSession,
      message: `${messages.length} messages added successfully`,
    });
  } catch (err) {
    console.error("Error adding multiple messages:", err);
    res.status(500).json({
      success: false,
      message: "Server error adding messages",
      error: err.message,
    });
  }
};

module.exports = {
  createSession,
  addMessage,
  getSessionById,
  getAllSessionsByUser,
  addMultipleMessages,
};
