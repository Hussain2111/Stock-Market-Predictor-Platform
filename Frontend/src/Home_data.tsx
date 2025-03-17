import {
    Search,
    TrendingUp,
    Brain,
    LineChart,
  } from "lucide-react";
  
  export const trendingStocks = [
    { symbol: "NVDA", name: "NVIDIA", change: "+3.43%", price: "$149.43" },
    { symbol: "AAPL", name: "Apple", change: "+1.21%", price: "$182.63" },
    { symbol: "MSFT", name: "Microsoft", change: "+2.15%", price: "$397.58" },
    { symbol: "META", name: "Meta", change: "+4.12%", price: "$394.14" },
  ];
  
  export const steps = [
    {
      title: "Input Your Criteria",
      description: "Select stocks, timeframes, and analysis parameters",
      icon: <Search className="w-8 h-8" />,
    },
    {
      title: "AI Analysis",
      description: "Our models process market data and indicators in real-time",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "Get Insights",
      description: "Receive actionable predictions and confidence scores",
      icon: <LineChart className="w-8 h-8" />,
    },
  ];
  
  export const stats = [
    { value: "$2.8T", label: "Assets Analyzed" },
    { value: "99.9%", label: "Uptime" },
    { value: "0.2s", label: "Average Response" },
  ];
  
  export const features = [
    { icon: <Brain className="w-8 h-8" />, title: "AI Analysis" },
    { icon: <LineChart className="w-8 h-8" />, title: "Real-time Data" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Predictive Models" },
  ];
  
  export const faqs = [
    {
      question: "How accurate are the AI predictions?",
      answer:
        "Our AI model achieves 70-85% accuracy for short-term predictions, continuously improving through machine learning.",
    },
    {
      question: "What data sources do you use?",
      answer:
        "We aggregate data from market feeds, financial statements, news articles, and macroeconomic indicators.",
    },
    {
      question: "How often is the analysis updated?",
      answer:
        "Analysis updates in real-time during market hours, with daily reports after market close.",
    },
  ];