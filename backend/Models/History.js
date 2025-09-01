const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "model", "bot"],
      required: true,
    },
    parts: [
      {
        text: {
          type: String,
          required: true,
        },
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      default: "New Session",
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    sessions: [sessionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
