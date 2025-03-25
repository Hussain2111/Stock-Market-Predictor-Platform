import React, { createContext, useContext, useState, useEffect } from "react";

interface PredictionData {
  next_day_price?: number;
  confidence_score?: number;
  price_change_text?: string;
  risk_level?: string;
  risk_description?: string;
  sentiment_adjusted_price?: number;
  average_deviation: number;
  price_change_percent: number;
  rmse: number;
}

interface PredictionContextType {
  predictionImage: string | null;
  priceHistoryImage: string | null;
  setPredictionImage: (image: string | null) => void;
  setPriceHistoryImage: (image: string | null) => void;
  currentTicker: string | null;
  setCurrentTicker: (ticker: string | null) => void;
  predictionData: PredictionData;
  setPredictionData: (data: PredictionData) => void;
}

const defaultPredictionData: PredictionData = {
  next_day_price: 0,
  average_deviation: 0,
  confidence_score: 85,
  risk_level: "Medium",
  risk_description: "Moderate Volatility",
  price_change_percent: 0,
  price_change_text: "+0.00% Upside",
  rmse: 0,
};

const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);

export function PredictionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [predictionImage, setPredictionImage] = useState<string | null>(null);
  const [priceHistoryImage, setPriceHistoryImage] = useState<string | null>(
    null
  );
  const [currentTicker, setCurrentTicker] = useState<string | null>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem("currentTicker") || null;
  });
  const [predictionData, setPredictionData] = useState<PredictionData>(
    defaultPredictionData
  );

  // Load prediction data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem("predictionData");
    if (savedData) {
      try {
        setPredictionData(JSON.parse(savedData));
      } catch (e) {
        console.error("Error parsing saved prediction data:", e);
      }
    }
  }, []);

  // Save prediction data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("predictionData", JSON.stringify(predictionData));
  }, [predictionData]);

  // Save currentTicker to localStorage when it changes
  useEffect(() => {
    if (currentTicker) {
      localStorage.setItem("currentTicker", currentTicker);
    }
  }, [currentTicker]);

  return (
    <PredictionContext.Provider
      value={{
        predictionImage,
        setPredictionImage,
        priceHistoryImage,
        setPriceHistoryImage,
        currentTicker,
        setCurrentTicker,
        predictionData,
        setPredictionData,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (undefined === context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
}
