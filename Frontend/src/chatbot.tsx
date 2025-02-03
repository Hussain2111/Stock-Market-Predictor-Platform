import React, { useState } from "react";
import { Send, MessageSquare, Loader, AlertTriangle, Type, Clock } from "lucide-react";

interface StockData {
  priceTarget: number;
  confidenceScore: number;
  recentNews: Array<{
    title: string;
    source: string;
    sentiment: string;
    time: string;
  }>;
  financialRatios: {
    peRatio: number;
    pegRatio: number;
    priceToBook: number;
    debtToEquity: number;
    revenueGrowth: number;
    epsGrowth: number;
  };
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
  isError?: boolean;
  isTyping?: boolean;
}

const formatTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const StockChatbot: React.FC<{ stockData: StockData }> = ({ stockData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI stock assistant. Ask me anything about Apple's stock performance.",
      isBot: true,
      timestamp: formatTimestamp(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: formatTimestamp(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Show Typing Indicator
    const typingIndicator: Message = {
      id: messages.length + 2,
      text: "Typing...",
      isBot: true,
      timestamp: formatTimestamp(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          symbol: "AAPL",
          userId: "user123",
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isTyping), // Remove typing indicator only before adding bot response
          {
            id: messages.length + 2,
            text: data.success ? data.response : "Sorry, I encountered an error.",
            isBot: true,
            timestamp: formatTimestamp(),
          },
        ]);
        setIsLoading(false);
      }, 2000); // Increased delay for more natural flow
    } catch (error) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isTyping), // Remove typing indicator
          {
            id: messages.length + 2,
            text: "⚠️ Error: Couldn't connect to server. Please try again.",
            isBot: true,
            isError: true,
            timestamp: formatTimestamp(),
          },
        ]);
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="w-1/4 bg-white border-l p-4 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <MessageSquare className="h-6 w-6 mr-2 text-blue-500" />
        <h2 className="text-xl font-bold">Stock AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.isError
                ? "bg-red-50 text-red-800 border border-red-400"
                : msg.isBot
                ? "bg-blue-50 text-blue-800"
                : "bg-gray-100 text-gray-800 self-end"
            } flex flex-col`}
          >
            <div className="flex items-center">
              {msg.isTyping && <Type className="h-4 w-4 animate-pulse mr-2 text-gray-600" />}
              {msg.isError && <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />}
              {msg.text}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {msg.timestamp}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask about the stock analysis..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg disabled:bg-gray-400"
          disabled={isLoading}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default StockChatbot;