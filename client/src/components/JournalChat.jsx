import { useState, useEffect, useRef } from "react";
import { apiService } from "../services/apiService";
import userAvatarSrc from "../assets/userAvatar.svg";
import aiAvatarSrc from "../assets/aiAvatar.svg";

// Helper for mood badge styling
const moodBadgeStyles = {
  happy: "bg-green-100 text-green-800",
  sad: "bg-blue-100 text-blue-800",
  stressed: "bg-red-100 text-red-800",
  tired: "bg-yellow-100 text-yellow-800",
  neutral: "bg-gray-100 text-gray-800",
  excited: "bg-pink-100 text-pink-800",
  // Add more mappings as needed based on your Entry model enums
  default: "bg-indigo-100 text-indigo-800", // Fallback style
};

const JournalChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [entryHistory, setEntryHistory] = useState([]); // State for storing entry history

  const messagesEndRef = useRef(null);

  const getCurrentDateString = () => new Date().toISOString().split("T")[0];

  // Fetch initial messages and entry history
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Fetch today's messages
        const today = getCurrentDateString();
        const chatData = await apiService.get(`/chat/date/${today}`);
        if (chatData && chatData.messages && chatData.messages.length > 0) {
          const fetchedMessages = chatData.messages.map((msg, index) => ({
            id: msg._id || index,
            author: msg.sender === "ai" ? "AI Assistant" : "You",
            avatar: msg.sender === "ai" ? aiAvatarSrc : userAvatarSrc,
            text: msg.text,
            timestamp: new Date(msg.timestamp),
            delivered: msg.sender === "user" ? "Delivered" : "",
            isAI: msg.sender === "ai",
          }));
          setMessages(fetchedMessages);
        } else {
          setMessages([
            {
              id: 1,
              author: "AI Assistant",
              avatar: aiAvatarSrc,
              text: "Welcome! How was your day?",
              timestamp: new Date(),
              delivered: "",
              isAI: true,
            },
          ]);
        }

        // Fetch entry history for sidebar
        const historyData = await apiService.get("/chat/history");
        if (historyData && Array.isArray(historyData)) {
          setEntryHistory(historyData);
        }
      } catch (err) {
        setError(err.message || "Failed to load initial data.");
        console.error("Fetch initial data error:", err);
        // Set default messages even if history fails, or handle specific errors
        if (!messages.length) {
          // Only set default if messages aren't already set by chatData success
          setMessages([
            {
              id: 1,
              author: "AI Assistant",
              avatar: aiAvatarSrc,
              text: "Could not load messages. How was your day?",
              timestamp: new Date(),
              delivered: "",
              isAI: true,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1 + Date.now(),
      author: "You",
      avatar: userAvatarSrc,
      text: newMessage,
      timestamp: new Date(),
      delivered: "Sending...",
      isAI: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = newMessage;
    setNewMessage("");
    setIsLoading(true);
    setError("");

    try {
      const today = getCurrentDateString();
      const response = await apiService.post("/chat/message", {
        text: messageToSend,
        date: today,
      });

      if (response && response.aiResponse && response.userMessage) {
        setMessages((prev) => {
          const optimisticMessageIndex = prev.findIndex(
            (m) => m.id === userMessage.id
          );
          const newMessages = [...prev];
          if (optimisticMessageIndex !== -1) {
            newMessages[optimisticMessageIndex] = {
              ...userMessage,
              id: response.userMessage._id || userMessage.id,
              delivered: "Delivered",
              timestamp: new Date(response.userMessage.timestamp),
            };
          }

          return [
            ...newMessages,
            {
              id: response.aiResponse._id || Date.now() + 1,
              author: "AI Assistant",
              avatar: aiAvatarSrc,
              text: response.aiResponse.text,
              timestamp: new Date(response.aiResponse.timestamp),
              delivered: "",
              isAI: true,
            },
          ];
        });
      } else {
        setError("Failed to get AI response.");
      }
    } catch (err) {
      setError(err.message || "Error sending message.");
      console.error("Send message error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, delivered: "Failed" } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCommand = async (commandText) => {
    setIsLoading(true);
    setError("");

    const commandMessage = {
      id: messages.length + 1 + Date.now(),
      author: "You (Command)",
      avatar: userAvatarSrc,
      text: commandText,
      timestamp: new Date(),
      delivered: "Sending command...",
      isAI: false,
    };
    setMessages((prev) => [...prev, commandMessage]);

    try {
      const today = getCurrentDateString();
      const response = await apiService.post("/chat/command", {
        command: commandText,
        date: today,
      });

      if (response && response.aiResponse) {
        setMessages((prev) => {
          const optimisticMessageIndex = prev.findIndex(
            (m) => m.id === commandMessage.id
          );
          const newMessages = [...prev];
          if (optimisticMessageIndex !== -1) {
            newMessages.splice(optimisticMessageIndex, 1);
          }
          return [
            ...newMessages,
            {
              id: response.aiResponse._id || Date.now() + 1,
              author: "AI Assistant",
              avatar: aiAvatarSrc,
              text: response.aiResponse.text,
              timestamp: new Date(response.aiResponse.timestamp),
              delivered: "",
              isAI: true,
            },
          ];
        });
      } else {
        setError("Failed to process command.");
      }
    } catch (err) {
      setError(err.message || "Error processing command.");
      console.error("Command error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Define quick actions with exact text expected by the backend service
  const quickActionCommands = [
    { id: "summarize", text: "Summarize my day" },
    { id: "motivate", text: "Give me motivation for tomorrow" },
    { id: "improve", text: "What can I improve this week?" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          fixed md:static inset-y-0 left-0 z-20
          w-80 bg-white p-6 border-r transition-transform duration-300 ease-in-out
          flex flex-col
        `}
      >
        {/* Profile */}
        <div className="flex items-center gap-4 mb-8 flex-shrink-0">
          <img
            src={aiAvatarSrc}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">Journal Companion</h2>
            <p className="text-sm text-gray-500">AI Assistant</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-auto md:hidden text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quick Actions Scrollable Wrapper (NEW) */}
        <div className="mb-8 flex-shrink-0 overflow-y-auto max-h-[calc(50vh-100px)] md:max-h-none md:overflow-visible">
          {/* Heuristic max-h for mobile, adjust 100px based on profile height + paddings */}
          <h3 className="mb-3 text-sm font-bold sticky top-0 bg-white py-1">
            Quick Actions
          </h3>
          {/* Sticky header for context */}
          <div className="space-y-2">
            {quickActionCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleQuickCommand(cmd.text)}
                className="w-full px-4 py-2 text-left bg-indigo-50 rounded-lg hover:bg-indigo-100"
              >
                {cmd.text}
              </button>
            ))}
          </div>
        </div>

        {/* Entry History with Mood Badges */}
        <div className="flex-grow overflow-y-auto">
          <h3 className="mb-3 text-sm font-bold sticky top-0 bg-white py-1">
            Entry History
          </h3>
          {/* Sticky header */}
          {isLoading && !entryHistory.length && (
            <p className="text-xs text-gray-500">Loading history...</p>
          )}
          {!isLoading && !entryHistory.length && (
            <p className="text-xs text-gray-500">No history found.</p>
          )}
          {entryHistory.length > 0 && (
            <div className="space-y-2">
              {entryHistory.map((entry) => (
                <div
                  key={entry.date}
                  className="p-2 bg-gray-50 rounded-md flex justify-between items-center"
                >
                  <span className="text-sm text-gray-700">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {entry.mood && (
                    <span
                      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                        moodBadgeStyles[entry.mood.toLowerCase()] ||
                        moodBadgeStyles.default
                      }`}
                    >
                      {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                    </span>
                  )}
                  {!entry.mood && (
                    <span
                      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${moodBadgeStyles.default}`}
                    >
                      No Mood
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-4 flex-shrink-0">
            Error: {error}
          </p>
        )}
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b bg-white flex items-center">
          <button onClick={toggleSidebar} className="mr-4 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">AI Journal</h1>
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.isAI ? "" : "justify-end"
              }`}
            >
              {!m.isAI && <div className="flex-1" />}

              <img
                src={m.avatar}
                alt={`${m.author} avatar`}
                className="w-8 h-8 rounded-full"
              />

              <div className="flex flex-col gap-1 w-full max-w-[320px]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900">
                    {m.author}
                  </span>
                  <span className="text-sm font-normal text-gray-500">
                    {m.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={`
                    p-4 border-gray-200
                    ${
                      m.isAI
                        ? "bg-white rounded-es-xl rounded-e-xl border"
                        : "bg-indigo-500 text-white rounded-s-xl rounded-ee-xl"
                    }
                  `}
                >
                  <p className="text-sm font-normal">{m.text}</p>
                </div>

                {m.delivered && !m.isAI && (
                  <span className="text-sm font-normal text-gray-500 flex justify-end">
                    {m.delivered}
                  </span>
                )}
              </div>

              {m.isAI && <div className="flex-1" />}
            </div>
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex items-start gap-2.5">
              <img
                src={aiAvatarSrc}
                alt="AI avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col gap-1 w-full max-w-[320px]">
                <div className="p-2 border-gray-200 rounded-es-xl rounded-e-xl border bg-white">
                  <div className="flex items-center justify-center h-[24px]">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounceDots"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounceDots animation-delay-[150ms] mx-1"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounceDots animation-delay-[300ms]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* Input */}
        <footer className="p-4 bg-white border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your journal entry..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
              disabled={isLoading || !newMessage.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9-7-9-7-9 7 9 7z"
                />
              </svg>
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default JournalChat;
