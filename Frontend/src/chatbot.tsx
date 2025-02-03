import React, { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

// Define interfaces for type safety
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
}

const StockChatbot: React.FC<{ stockData: StockData }> = ({ stockData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI stock analysis assistant. Ask me anything about Apple's stock performance.",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage: Message = {
      id: messages.length + 2,
      text: "Thinking...",
      isBot: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      console.log("Sending request to chat endpoint..."); // Debug log
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

      console.log("Received response:", response); // Debug log
      const data = await response.json();
      console.log("Parsed data:", data); // Debug log

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));

      if (data.success) {
        const botResponse: Message = {
          id: messages.length + 2,
          text: data.response,
          isBot: true,
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const errorMessage: Message = {
          id: messages.length + 2,
          text: "Sorry, I encountered an error. Please try again.",
          isBot: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        console.error("Error:", data.error);
      }
    } catch (error) {
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));

      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I couldn't connect to the server. Please try again.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error:", error);
    }

    setInputMessage("");
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("price target")) {
      return `Based on the analysis, the price target is $${stockData.priceTarget} with a potential upside of 7.2%. The model shows an ${stockData.confidenceScore}% confidence in this prediction.`;
    }

    if (lowerQuery.includes("sentiment") || lowerQuery.includes("news")) {
      const newsSnippet = stockData.recentNews
        .map((news) => `${news.title} (${news.sentiment})`)
        .join("\n");
      return `Current market sentiment includes:\n${newsSnippet}`;
    }

    if (lowerQuery.includes("financial") || lowerQuery.includes("ratios")) {
      const { financialRatios: fr } = stockData;
      return `Key financial metrics:
      - P/E Ratio: ${fr.peRatio}
      - PEG Ratio: ${fr.pegRatio}
      - Price/Book: ${fr.priceToBook}
      - Debt/Equity: ${fr.debtToEquity}
      - Revenue Growth (YoY): +${fr.revenueGrowth}%
      - EPS Growth (YoY): +${fr.epsGrowth}%`;
    }

    return "I can help with questions about price targets, sentiment, financial ratios, or stock analysis. What would you like to know?";
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
              msg.isBot
                ? "bg-blue-50 text-blue-800"
                : "bg-gray-100 text-white-800 self-end"
            }`}
          >
            {msg.text}
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
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default StockChatbot;
