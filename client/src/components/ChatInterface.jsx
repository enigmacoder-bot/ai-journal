// ChatInterface.jsx - Main chat component
import React, { useState, useEffect, useRef } from "react";
import { Send, Plus } from "lucide-react";
import Layout from "../Layout";

function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const messagesEndRef = useRef(null);

  // Mock commands
  const quickCommands = [
    { id: 1, text: "Summarize my day" },
    { id: 2, text: "Motivation for tomorrow" },
    { id: 3, text: "What can I improve?" },
    { id: 4, text: "How am I feeling?" },
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Load initial message when component mounts
  useEffect(() => {
    // In a real app, you would load existing chat history for the day
    setChatHistory([
      {
        id: 1,
        type: "ai",
        text: "Welcome to your AI Journal! How was your day today?",
        timestamp: new Date(),
        mood: null,
      },
    ]);
  }, []);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (message.trim() === "") return;

    // Add user message to chat
    const newUserMessage = {
      id: chatHistory.length + 1,
      type: "user",
      text: message,
      timestamp: new Date(),
      mood: null, // In real app, this would be determined by AI
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setMessage("");
    setIsLoading(true);

    // In a real app, send to backend API which calls Gemini
    // For now, simulate an AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: "ai",
        text: "Thank you for sharing! I notice you've had quite an eventful day. Would you like to reflect on what went well today, or perhaps talk about what you're looking forward to tomorrow?",
        timestamp: new Date(),
        mood: "positive", // Example mood tag
      };

      setChatHistory((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickCommand = (command) => {
    setMessage(command);
    handleSendMessage();
  };

  const formatMessageDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* Date Header */}
        <div className="bg-base-200 p-3 flex justify-between items-center shadow-sm">
          <div className="flex-1">
            <h2 className="text-center font-medium">
              {formatMessageDate(currentDate)}
            </h2>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-grow p-4 overflow-y-auto bg-base-100">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`chat ${
                msg.type === "user" ? "chat-end" : "chat-start"
              } mb-4`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      msg.type === "user"
                        ? "/api/placeholder/40/40"
                        : "/api/placeholder/40/40"
                    }
                    alt=""
                  />
                </div>
              </div>
              <div
                className={`chat-bubble ${
                  msg.type === "user"
                    ? "chat-bubble-primary"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {msg.text}
              </div>
              <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {msg.mood && msg.type === "user" && (
                  <span className="badge badge-sm">
                    {msg.mood === "positive"
                      ? "😊"
                      : msg.mood === "negative"
                      ? "😔"
                      : "😐"}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src="/api/placeholder/40/40" alt="AI" />
                </div>
              </div>
              <div className="chat-bubble bg-base-200">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Commands */}
        <div className="bg-base-200 p-2 flex gap-2 overflow-x-auto">
          {quickCommands.map((cmd) => (
            <button
              key={cmd.id}
              className="btn btn-sm btn-outline whitespace-nowrap"
              onClick={() => handleQuickCommand(cmd.text)}
            >
              {cmd.text}
            </button>
          ))}
          <button className="btn btn-sm btn-outline btn-circle">
            <Plus size={16} />
          </button>
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-base-200 bg-base-100"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write in your journal..."
              className="input input-bordered flex-grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || message.trim() === ""}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ChatInterface;
