import { AlgorithmOption } from "./interfaces.tsx";

// Algorithm definitions
export const algorithms: AlgorithmOption[] = [
  {
    id: "sma-crossover",
    name: "SMA Crossover",
    description:
      "Buys when short-term SMA crosses above long-term SMA and sells when it crosses below.",
    parameters: {
      shortPeriod: {
        name: "Short Period",
        defaultValue: 10,
        min: 2,
        max: 50,
        step: 1,
      },
      longPeriod: {
        name: "Long Period",
        defaultValue: 30,
        min: 5,
        max: 200,
        step: 1,
      },
      initialCapital: {
        name: "Initial Capital ($)",
        defaultValue: 10000,
        min: 1000,
        max: 1000000,
        step: 1000,
      },
    },
  },
  {
    id: "rsi",
    name: "RSI Strategy",
    description:
      "Buys when RSI exits oversold territory and sells when it exits overbought territory.",
    parameters: {
      period: {
        name: "RSI Period",
        defaultValue: 14,
        min: 2,
        max: 50,
        step: 1,
      },
      overbought: {
        name: "Overbought Level",
        defaultValue: 70,
        min: 50,
        max: 90,
        step: 1,
      },
      oversold: {
        name: "Oversold Level",
        defaultValue: 30,
        min: 10,
        max: 50,
        step: 1,
      },
      initialCapital: {
        name: "Initial Capital ($)",
        defaultValue: 10000,
        min: 1000,
        max: 1000000,
        step: 1000,
      },
    },
  },
  {
    id: "macd",
    name: "MACD Strategy",
    description:
      "Buys when MACD line crosses above signal line and sells when it crosses below.",
    parameters: {
      fastPeriod: {
        name: "Fast EMA Period",
        defaultValue: 12,
        min: 2,
        max: 50,
        step: 1,
      },
      slowPeriod: {
        name: "Slow EMA Period",
        defaultValue: 26,
        min: 5,
        max: 100,
        step: 1,
      },
      signalPeriod: {
        name: "Signal Period",
        defaultValue: 9,
        min: 2,
        max: 50,
        step: 1,
      },
      initialCapital: {
        name: "Initial Capital ($)",
        defaultValue: 10000,
        min: 1000,
        max: 1000000,
        step: 1000,
      },
    },
  },
  {
    id: "bollinger",
    name: "Bollinger Bands",
    description:
      "Buys when price touches lower band and sells when it touches upper band.",
    parameters: {
      period: {
        name: "SMA Period",
        defaultValue: 20,
        min: 5,
        max: 100,
        step: 1,
      },
      stdDev: {
        name: "Standard Deviation Multiplier",
        defaultValue: 2,
        min: 0.5,
        max: 5,
        step: 0.1,
      },
      initialCapital: {
        name: "Initial Capital ($)",
        defaultValue: 10000,
        min: 1000,
        max: 1000000,
        step: 1000,
      },
    },
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description:
      "Buys when price is significantly below mean and sells when it returns to the mean.",
    parameters: {
      lookbackPeriod: {
        name: "Lookback Period",
        defaultValue: 20,
        min: 5,
        max: 100,
        step: 1,
      },
      entryThreshold: {
        name: "Entry Threshold (stdDev)",
        defaultValue: 1.5,
        min: 0.5,
        max: 5,
        step: 0.1,
      },
      exitThreshold: {
        name: "Exit Threshold (stdDev)",
        defaultValue: 0.5,
        min: 0,
        max: 3,
        step: 0.1,
      },
      initialCapital: {
        name: "Initial Capital ($)",
        defaultValue: 10000,
        min: 1000,
        max: 1000000,
        step: 1000,
      },
    },
  },
];
