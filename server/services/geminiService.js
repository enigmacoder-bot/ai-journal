// This is a conceptual example. You'll need to install and use the
// official Google Gemini API client library (e.g., @google/generative-ai).
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" }); // Old model name
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Updated to gemini-2.0-flash

async function getSimpleChatResponse(userInput) {
  try {
    const prompt = `You are an empathetic and constructive journal assistant. A user has written the following journal entry: "${userInput}". Please provide a short, supportive, and insightful reply.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI service.");
  }
}

async function processCommand(command, context = {}) {
  let prompt;
  switch (command) {
    case "Summarize my day":
      // Assuming context.dailyMessages is an array of {sender, text} objects for the day
      const messagesText = context.dailyMessages
        .map((m) => `${m.sender}: ${m.text}`)
        .join("\n");
      prompt = `Based on the following conversation log for the day, please provide a concise summary of the user's day:\n\n${messagesText}\n\nSummary:`;
      break;
    case "Give me motivation for tomorrow":
      prompt = `The user is looking for motivation for tomorrow. ${
        context.userContext || ""
      } Please provide an encouraging and uplifting message.`;
      break;
    case "What can I improve this week?":
      // This might need more context, perhaps from past entries.
      // For a simpler version, it can provide general advice.
      const weeklyContext = context.weeklyEntries
        ? `Here are some entries from this week: ${context.weeklyEntries
            .map((e) => e.text)
            .join("; ")}`
        : "";
      prompt = `A user is asking for areas of improvement for the week. ${weeklyContext} Based on general well-being principles or any provided context, suggest one or two actionable things they could focus on.`;
      break;
    default:
      return "Sorry, I don't understand that command.";
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error calling Gemini API for command:", error);
    throw new Error("Failed to get response from AI service for command.");
  }
}

async function analyzeSentiment(text) {
  try {
    const prompt = `Analyze the sentiment of the following text and classify it as primarily 'happy', 'sad', 'neutral', 'stressed', 'tired', or 'excited'. Provide only the label. Text: "${text}" \nSentiment:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let sentiment = response.text().trim().toLowerCase();

    // Basic validation
    const validSentiments = [
      "happy",
      "sad",
      "neutral",
      "stressed",
      "tired",
      "excited",
    ];
    if (!validSentiments.includes(sentiment)) {
      sentiment = "neutral"; // Default if Gemini gives an unexpected response
    }
    return sentiment;
  } catch (error) {
    console.error("Error calling Gemini API for sentiment analysis:", error);
    return "neutral"; // Default on error
  }
}

module.exports = {
  getSimpleChatResponse,
  processCommand,
  analyzeSentiment,
};
