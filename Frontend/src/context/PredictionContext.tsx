import React, { createContext, useContext, useState } from 'react';

interface PredictionContextType {
  predictionImage: string | null;
  priceHistoryImage: string | null;
  setPredictionImage: (image: string | null) => void;
  setPriceHistoryImage: (image: string | null) => void;
  currentTicker: string | null;
  setCurrentTicker: (ticker: string | null) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function PredictionProvider({ children }: { children: React.ReactNode }) {
  const [predictionImage, setPredictionImage] = useState<string | null>(null);
  const [priceHistoryImage, setPriceHistoryImage] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);

  return (
    <PredictionContext.Provider 
      value={{ 
        predictionImage, 
        setPredictionImage, 
        priceHistoryImage, 
        setPriceHistoryImage,
        currentTicker,
        setCurrentTicker
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (undefined === context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
} 