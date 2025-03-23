// AlgorithmRunner.tsx
import React, { useState, useEffect } from "react";
import { AlgorithmResult, AlgorithmRunnerProps } from "./interfaces.tsx";
import { runBollingerBandsStrategy } from "./BollingerBandsStrategy.tsx";
import { runMACDStrategy } from "./MACDStrategy.tsx";
import { runRSIStrategy } from "./RSIStrategy.tsx";
import { runSMACrossover } from "./SMACrossover.tsx";
import { runMeanReversionStrategy } from "./MeanReversionStrategy.tsx";
import { algorithms } from "./AlgorithmsDefinition.tsx";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Main component
const AlgorithmRunner: React.FC<AlgorithmRunnerProps> = ({
  stockData,
  timePeriod,
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<string>("sma-crossover");
  const [parameters, setParameters] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [runningAlgorithm, setRunningAlgorithm] = useState(false);

  // Reset parameters when selected algorithm changes
  useEffect(() => {
    const algorithm = algorithms.find((a) => a.id === selectedAlgorithm);
    if (algorithm) {
      const initialParams: { [key: string]: number } = {};
      Object.entries(algorithm.parameters).forEach(([key, param]) => {
        initialParams[key] = param.defaultValue;
      });
      setParameters(initialParams);
    }
  }, [selectedAlgorithm]);

  // Run the selected algorithm
  const runAlgorithm = () => {
    if (
      !stockData ||
      !stockData.priceData ||
      stockData.priceData.length === 0
    ) {
      return;
    }

    setRunningAlgorithm(true);

    // Use setTimeout to allow UI to update before running the algorithm
    setTimeout(() => {
      try {
        let algorithmResult: AlgorithmResult | null = null;

        switch (selectedAlgorithm) {
          case "sma-crossover":
            algorithmResult = runSMACrossover(
              stockData.priceData,
              parameters.shortPeriod,
              parameters.longPeriod,
              parameters.initialCapital
            );
            break;
          case "rsi":
            algorithmResult = runRSIStrategy(
              stockData.priceData,
              parameters.period,
              parameters.overbought,
              parameters.oversold,
              parameters.initialCapital
            );
            break;
          case "macd":
            algorithmResult = runMACDStrategy(
              stockData.priceData,
              parameters.fastPeriod,
              parameters.slowPeriod,
              parameters.signalPeriod,
              parameters.initialCapital
            );
            break;
          case "bollinger":
            algorithmResult = runBollingerBandsStrategy(
              stockData.priceData,
              parameters.period,
              parameters.stdDev,
              parameters.initialCapital
            );
            break;
          case "mean-reversion":
            algorithmResult = runMeanReversionStrategy(
              stockData.priceData,
              parameters.lookbackPeriod,
              parameters.entryThreshold,
              parameters.exitThreshold,
              parameters.initialCapital
            );
            break;
          default:
            break;
        }

        setResult(algorithmResult);
      } catch (error) {
        console.error("Error running algorithm:", error);
        alert("Failed to run algorithm. Check console for details.");
      } finally {
        setRunningAlgorithm(false);
      }
    }, 100);
  };

  // Handle parameter change
  const handleParameterChange = (paramName: string, value: number) => {
    setParameters({
      ...parameters,
      [paramName]: value,
    });
  };

  // Get the selected algorithm
  const algorithm = algorithms.find((a) => a.id === selectedAlgorithm);

  return (
    <div className="bg-gray-800/40 rounded-lg border border-gray-700 p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Algorithmic Trading Backtest</h2>

      {!stockData?.priceData ? (
        <div className="text-gray-400">Select a stock to run algorithms</div>
      ) : (
        <>
          {/* Algorithm Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Select Algorithm
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>

            {algorithm && (
              <p className="mt-1 text-sm text-gray-400">
                {algorithm.description}
              </p>
            )}
          </div>

          {/* Algorithm Parameters */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithm &&
                Object.entries(algorithm.parameters).map(([key, param]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {param.name}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={parameters[key] || param.defaultValue}
                        onChange={(e) =>
                          handleParameterChange(key, Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 w-16 text-center">
                        {parameters[key] || param.defaultValue}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Run Algorithm Button */}
          <div className="mb-6">
            <button
              onClick={runAlgorithm}
              disabled={runningAlgorithm}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {runningAlgorithm ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running...
                </span>
              ) : (
                "Run Backtest"
              )}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-4">Results</h3>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/70 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Profit/Loss</div>
                  <div
                    className={`text-xl font-bold ${
                      result.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${result.profitLoss.toFixed(2)}
                  </div>
                  <div
                    className={`text-sm ${
                      result.profitLossPercent >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {result.profitLossPercent.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-800/70 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Max Drawdown</div>
                  <div className="text-xl font-bold text-red-500">
                    {(result.maxDrawdown * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-800/70 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Sharpe Ratio</div>
                  <div className="text-xl font-bold">
                    {result.sharpeRatio.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800/70 p-3 rounded-lg">
                  <div className="text-gray-400 text-sm">Trades</div>
                  <div className="text-xl font-bold">
                    {result.trades.length}
                  </div>
                </div>
              </div>

              {/* Equity Curve Chart */}
              <div className="w-full h-60 mb-6">
                <h4 className="text-md font-medium mb-2">Equity Curve</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.returns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#aaa" }}
                      tickFormatter={(value) => {
                        // Format date based on time period
                        if (timePeriod === "1d") return value.split(" ")[1]; // Show time for 1d
                        if (["1wk", "1mo"].includes(timePeriod))
                          return value.split("-")[2]; // Show day for short periods
                        return value.split("-").slice(1).join("/"); // Show month/day for longer periods
                      }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fill: "#aaa" }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value: any) => [
                        `$${Number(value).toFixed(2)}`,
                        "Portfolio Value",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                      }}
                    />
                    <ReferenceLine
                      y={parameters.initialCapital}
                      stroke="#666"
                      strokeDasharray="3 3"
                      label={{
                        value: "Initial Capital",
                        position: "left",
                        fill: "#666",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Trades Table */}
              <div>
                <h4 className="text-md font-medium mb-2">Trade History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Shares
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800/20 divide-y divide-gray-700">
                      {result.trades.map((trade, index) => (
                        <tr key={index}>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                            {trade.date}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                trade.type === "buy"
                                  ? "bg-green-900/50 text-green-400"
                                  : "bg-red-900/50 text-red-400"
                              }`}
                            >
                              {trade.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                            {trade.shares}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                            ${trade.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                            ${(trade.price * trade.shares).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlgorithmRunner;
