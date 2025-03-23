import { Trade, AlgorithmResult } from "./interfaces.tsx";

export const runMeanReversionStrategy = (
  priceData: any[],
  lookbackPeriod: number,
  entryThreshold: number,
  exitThreshold: number,
  initialCapital: number
): AlgorithmResult => {
  const closePrices = priceData.map((d) => d.Close);

  let inPosition = false;
  let capital = initialCapital;
  let shares = 0;

  const trades: Trade[] = [];
  const returns = [{ date: priceData[0].Date, value: initialCapital }];
  let highestCapital = initialCapital;
  let maxDrawdown = 0;

  // Track portfolio value at each point
  const portfolioValues: number[] = [];

  for (let i = lookbackPeriod; i < priceData.length; i++) {
    const date = priceData[i].Date;
    const price = priceData[i].Close;

    // Calculate mean and standard deviation of the lookback window
    let sum = 0;
    for (let j = 0; j < lookbackPeriod; j++) {
      sum += closePrices[i - j - 1]; // Don't include current price
    }
    const mean = sum / lookbackPeriod;

    let sumSquareDiff = 0;
    for (let j = 0; j < lookbackPeriod; j++) {
      sumSquareDiff += Math.pow(closePrices[i - j - 1] - mean, 2);
    }
    const stdDev = Math.sqrt(sumSquareDiff / lookbackPeriod);

    // Calculate z-score (how many standard deviations away from mean)
    const zScore = (price - mean) / stdDev;

    // Buy signal: Price is significantly below mean
    if (!inPosition && zScore < -entryThreshold) {
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
    // Sell signal: Price has reverted close to or above mean
    else if (inPosition && zScore > -exitThreshold) {
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
