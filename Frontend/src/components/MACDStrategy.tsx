import { Trade, AlgorithmResult } from "./interfaces.tsx";
import { calculateMACD } from "./AlgorithmsUtilities.tsx";

export const runMACDStrategy = (
  priceData: any[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number,
  initialCapital: number
): AlgorithmResult => {
  const closePrices = priceData.map((d) => d.Close);
  const { macd, signal } = calculateMACD(
    closePrices,
    fastPeriod,
    slowPeriod,
    signalPeriod
  );

  let inPosition = false;
  let capital = initialCapital;
  let shares = 0;

  const trades: Trade[] = [];
  const returns = [{ date: priceData[0].Date, value: initialCapital }];
  let highestCapital = initialCapital;
  let maxDrawdown = 0;

  // Track portfolio value at each point
  const portfolioValues: number[] = [];

  // Start after MACD has enough data
  const startIdx = Math.max(fastPeriod, slowPeriod) + signalPeriod;

  for (let i = startIdx; i < priceData.length; i++) {
    const date = priceData[i].Date;
    const price = priceData[i].Close;
    const macdValue = macd[i];
    const signalValue = signal[i];
    const prevMacdValue = macd[i - 1];
    const prevSignalValue = signal[i - 1];

    // Buy signal: MACD crosses above signal line
    if (
      !inPosition &&
      prevMacdValue <= prevSignalValue &&
      macdValue > signalValue
    ) {
      shares = Math.floor(capital / price);
      capital -= shares * price;
      inPosition = true;

      trades.push({
        date,
        price,
        type: "buy",
        shares,
      });
    }
    // Sell signal: MACD crosses below signal line
    else if (
      inPosition &&
      prevMacdValue >= prevSignalValue &&
      macdValue < signalValue
    ) {
      capital += shares * price;

      trades.push({
        date,
        price,
        type: "sell",
        shares,
      });

      shares = 0;
      inPosition = false;
    }

    // Calculate portfolio value
    const portfolioValue = capital + shares * price;
    portfolioValues.push(portfolioValue);
    returns.push({ date, value: portfolioValue });

    // Track highest portfolio value and max drawdown
    if (portfolioValue > highestCapital) {
      highestCapital = portfolioValue;
    }

    const drawdown = (highestCapital - portfolioValue) / highestCapital;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // If still holding stocks at the end, sell them
  const lastPrice = priceData[priceData.length - 1].Close;
  const lastDate = priceData[priceData.length - 1].Date;
  if (inPosition) {
    capital += shares * lastPrice;

    trades.push({
      date: lastDate,
      price: lastPrice,
      type: "sell",
      shares,
    });
  }

  // Calculate final P&L
  const finalValue = capital;
  const profitLoss = finalValue - initialCapital;
  const profitLossPercent = (profitLoss / initialCapital) * 100;

  // Calculate Sharpe ratio (simplified)
  let dailyReturns = [];
  for (let i = 1; i < portfolioValues.length; i++) {
    dailyReturns.push(
      (portfolioValues[i] - portfolioValues[i - 1]) / portfolioValues[i - 1]
    );
  }

  const avgReturn =
    dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
  const stdDevReturn = Math.sqrt(
    dailyReturns.reduce((sum, val) => sum + Math.pow(val - avgReturn, 2), 0) /
      dailyReturns.length
  );
  const sharpeRatio =
    stdDevReturn === 0 ? 0 : (avgReturn / stdDevReturn) * Math.sqrt(252); // Annualized

  return {
    trades,
    profitLoss,
    profitLossPercent,
    maxDrawdown,
    sharpeRatio,
    returns,
  };
};
