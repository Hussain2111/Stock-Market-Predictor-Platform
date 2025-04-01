import { Trade, AlgorithmResult } from "./interfaces.tsx";
import { calculateSMA } from "./AlgorithmsUtilities.tsx";

export const runSMACrossover = (
  priceData: any[],
  shortPeriod: number,
  longPeriod: number,
  initialCapital: number
): AlgorithmResult => {
  const closePrices = priceData.map((d) => d.Close);
  const shortSMA = calculateSMA(closePrices, shortPeriod);
  const longSMA = calculateSMA(closePrices, longPeriod);

  let inPosition = false;
  let capital = initialCapital;
  let shares = 0;
  let entryPrice = 0;

  const trades: Trade[] = [];
  const returns = [{ date: priceData[0].Date, value: initialCapital }];
  let highestCapital = initialCapital;
  let maxDrawdown = 0;

  // Track portfolio value at each point
  const portfolioValues: number[] = [];

  for (let i = longPeriod; i < priceData.length; i++) {
    const date = priceData[i].Date;
    const price = priceData[i].Close;
    const prevShortSMA = shortSMA[i - 1];
    const prevLongSMA = longSMA[i - 1];
    const currShortSMA = shortSMA[i];
    const currLongSMA = longSMA[i];

    // Buy signal: short SMA crosses above long SMA
    if (
      !inPosition &&
      prevShortSMA <= prevLongSMA &&
      currShortSMA > currLongSMA
    ) {
      shares = Math.floor(capital / price);
      capital -= shares * price;
      entryPrice = price;
      inPosition = true;

      trades.push({
        date,
        price,
        type: "buy",
        shares,
      });
    }
    // Sell signal: short SMA crosses below long SMA
    else if (
      inPosition &&
      prevShortSMA >= prevLongSMA &&
      currShortSMA < currLongSMA
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
