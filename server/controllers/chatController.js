const Entry = require("../models/Entry");
const geminiService = require("../services/geminiService");

exports.postMessage = async (req, res) => {
  const { text, date } = req.body;
  const userId = req.user.id; // Assuming authMiddleware adds user to req

  if (!text || !date) {
    return res.status(400).json({ message: "Text and date are required." });
  }

  try {
    const entryDate = new Date(date + "T00:00:00.000Z"); // Ensure UTC date

    // User message
    const userMessage = { sender: "user", text, timestamp: new Date() };

    // Get AI response
    const aiResponseText = await geminiService.getSimpleChatResponse(text);
    const aiMessage = {
      sender: "ai",
      text: aiResponseText,
      timestamp: new Date(),
    };

    // Analyze sentiment of user's message
    const mood = await geminiService.analyzeSentiment(text);

    // Find or create entry for the day
    let entry = await Entry.findOneAndUpdate(
      { userId, date: entryDate },
      {
        $push: { messages: { $each: [userMessage, aiMessage] } },
        $set: { mood: mood }, // This might overwrite if multiple messages in a day. Better to average or take latest significant.
        // For simplicity, setting it with each new user message.
        // A more robust solution might update mood based on overall day or specific prompts.
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      userMessage,
      aiResponse: aiMessage,
      mood: entry.mood, // Return the determined mood
      entryId: entry._id,
    });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ message: "Server error while processing message." });
  }
};

exports.handleCommand = async (req, res) => {
  const { command, date, context } = req.body; // date 'YYYY-MM-DD', context optional
  const userId = req.user.id;

  try {
    let commandContext = context || {};
    if (command === "Summarize my day" && date) {
      const entryDate = new Date(date + "T00:00:00.000Z");
      const entry = await Entry.findOne({ userId, date: entryDate });
      if (entry) {
        commandContext.dailyMessages = entry.messages;
      } else {
        return res
          .status(404)
          .json({ message: "No entries found for this date to summarize." });
      }
    }
    // Add more context fetching logic for other commands as needed

    const aiResponseText = await geminiService.processCommand(
      command,
      commandContext
    );
    const aiMessage = {
      sender: "ai",
      text: aiResponseText,
      timestamp: new Date(),
    };

    // Optionally, save this command and response to the journal for the relevant date
    if (date) {
      const entryDate = new Date(date + "T00:00:00.000Z");
      await Entry.findOneAndUpdate(
        { userId, date: entryDate },
        { $push: { messages: aiMessage } }, // Could also save the user command
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ aiResponse: aiMessage });
  } catch (error) {
    console.error("Error processing command:", error);
    res.status(500).json({ message: "Server error while processing command." });
  }
};

// @desc    Get all messages for a specific date for the logged-in user
// @route   GET /api/chat/date/:date
// @access  Private
exports.getMessagesByDate = async (req, res) => {
  const { date } = req.params; // date is YYYY-MM-DD from route
  const userId = req.user.id;

  if (!date) {
    return res.status(400).json({ message: "Date parameter is required." });
  }

  try {
    const entryDate = new Date(date + "T00:00:00.000Z");
    const entry = await Entry.findOne({ userId, date: entryDate });

    if (entry) {
      res.status(200).json(entry); // Includes messages, mood, dailySummary
    } else {
      res.status(200).json({ messages: [], mood: null, dailySummary: "" }); // Send empty if no entry for the day
    }
  } catch (error) {
    console.error("Error fetching messages by date:", error);
    res.status(500).json({ message: "Server error while fetching messages." });
  }
};

// @desc    Get a summary of available journal dates or recent entries for the user
// @route   GET /api/chat/history
// @access  Private
exports.getEntryHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    // Example: Fetch dates for which entries exist, sorted descending
    const entries = await Entry.find({ userId })
      .sort({ date: -1 })
      .select("date mood messagesCount dailySummary -_id") // Customize selection as needed
      .limit(30); // Limit to recent 30 entries or implement pagination

    // You might want to transform this data further
    const history = entries.map((entry) => ({
      date: entry.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      mood: entry.mood,
      messageCount: entry.messages ? entry.messages.length : 0, // If you store messageCount directly
      dailySummary: entry.dailySummary,
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching entry history:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching entry history." });
  }
};
