import { Trade, AlgorithmResult } from "./interfaces.tsx";
import { calculateRSI } from "./AlgorithmsUtilities.tsx";

export const runRSIStrategy = (
  priceData: any[],
  period: number,
  overbought: number,
  oversold: number,
  initialCapital: number
): AlgorithmResult => {
  const closePrices = priceData.map((d) => d.Close);
  const rsiValues = calculateRSI(closePrices, period);

  let inPosition = false;
  let capital = initialCapital;
  let shares = 0;
  let wasOversold = false;
  let wasOverbought = false;

  const trades: Trade[] = [];
  const returns = [{ date: priceData[0].Date, value: initialCapital }];
  let highestCapital = initialCapital;
  let maxDrawdown = 0;

  // Track portfolio value at each point
  const portfolioValues: number[] = [];

  for (let i = period + 1; i < priceData.length; i++) {
    const date = priceData[i].Date;
    const price = priceData[i].Close;
    const currentRSI = rsiValues[i];
    const prevRSI = rsiValues[i - 1];

    // Check if we're coming from oversold territory
    if (prevRSI !== null && prevRSI <= oversold) {
      wasOversold = true;
    }

    // Check if we're coming from overbought territory
    if (prevRSI !== null && prevRSI >= overbought) {
      wasOverbought = true;
    }

    // Buy signal: RSI was oversold and is now rising above oversold
    if (
      !inPosition &&
      wasOversold &&
      currentRSI !== null &&
      currentRSI > oversold
    ) {
      shares = Math.floor(capital / price);
      capital -= shares * price;
      inPosition = true;
      wasOversold = false;

      trades.push({
        date,
        price,
        type: "buy",
        shares,
      });
    }
    // Sell signal: RSI was overbought and is now falling below overbought
    else if (
      inPosition &&
      wasOverbought &&
      currentRSI !== null &&
      currentRSI < overbought
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
      wasOverbought = false;
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

  // Calculating final P&L
  const finalValue = capital;
  const profitLoss = finalValue - initialCapital;
  const profitLossPercent = (profitLoss / initialCapital) * 100;

  // Calculating Sharpe ratio
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
    // Annualised
    stdDevReturn === 0 ? 0 : (avgReturn / stdDevReturn) * Math.sqrt(252);

  return {
    trades,
    profitLoss,
    profitLossPercent,
    maxDrawdown,
    sharpeRatio,
    returns,
  };
};
