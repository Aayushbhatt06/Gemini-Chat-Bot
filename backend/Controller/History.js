const historyModel = require("../Models/History");

const createSession = async (req, res) => {
  const { userId, sessionName } = req.body;
  try {
    const newSession = new historyModel({ userId, sessionName, messages: [] });
    await newSession.save();
    res.status(201).json({ success: true, session: newSession });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addMessage = async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message)
    return res.status(400).json({ success: false, message: "Missing data" });

  try {
    const session = await historyModel.findById(sessionId);
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    session.messages.push(message);
    await session.save();

    res.status(200).json({ success: true, session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSessionById = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await historyModel
      .findById(sessionId)
      .populate("userId", "name email");
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    res.status(200).json({ success: true, session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllSessionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const sessions = await historyModel
      .find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createSession,
  addMessage,
  getSessionById,
  getAllSessionsByUser,
};
