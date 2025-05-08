const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String, // 'user' or 'ai'
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Optional: for specific AI commands or metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const EntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    // Represents the calendar date of the entry
    type: Date,
    required: true,
  },
  messages: [MessageSchema], // Array of user and AI messages for that day
  mood: {
    // Overall mood for the day, derived from sentiment analysis
    type: String,
    enum: ["happy", "sad", "neutral", "stressed", "tired", "excited", null], // Extend as needed
    default: null,
  },
  dailySummary: {
    // AI-generated end-of-day summary
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying by user and date
EntrySchema.index({ userId: 1, date: -1 });

EntrySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Entry", EntrySchema);
