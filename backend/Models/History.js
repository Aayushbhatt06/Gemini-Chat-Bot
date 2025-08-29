const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "model"], required: true },
    parts: [{ text: { type: String, required: true } }],
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionName: { type: String, default: "New Session" }, // optional label for the session
    messages: [messageSchema],
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model("History", historySchema);
