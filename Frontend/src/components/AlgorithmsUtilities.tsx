// Utility functions for algorithm calculations

export const calculateSMA = (data: number[], period: number): number[] => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    result.push(sum / period);
  }
  return result.filter((value) => value !== null) as number[];
};

export const calculateRSI = (data: number[], period: number): number[] => {
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }

  const result = [];
  result.push(null); // First point has no RSI

  for (let i = 1; i < data.length; i++) {
    if (i < period) {
      result.push(null);
      continue;
    }

    let gains = 0;
    let losses = 0;

    for (let j = 0; j < period; j++) {
      const change = changes[i - j - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) {
      result.push(100); // If no losses, RSI is 100
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(rsi);
    }
  }

  return result.filter((value) => value !== null) as number[];
};

export const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const result = [];
  let ema = data[0];

  result.push(ema);

  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    result.push(ema);
  }

  return result;
};

export const calculateMACD = (
  data: number[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number
): { macd: number[]; signal: number[]; histogram: number[] } => {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

  return { macd: macdLine, signal: signalLine, histogram };
};

export const calculateBollingerBands = (
  data: number[],
  period: number,
  stdDevMultiplier: number
): { sma: number[]; upper: (number | null)[]; lower: (number | null)[] } => {
  const sma = calculateSMA(data, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      lower.push(null);
      continue;
    }

    // Calculate standard deviation for the specified window
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[i - j] - sma[i], 2);
    }
    const stdDev = Math.sqrt(sum / period);

    upper.push(sma[i] + stdDevMultiplier * stdDev);
    lower.push(sma[i] - stdDevMultiplier * stdDev);
  }

  return { sma, upper, lower };
};
