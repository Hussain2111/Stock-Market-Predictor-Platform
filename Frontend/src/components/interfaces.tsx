// Types
export interface Trade {
  date: string;
  price: number;
  type: "buy" | "sell";
  shares: number;
}

export interface AlgorithmResult {
  trades: Trade[];
  profitLoss: number;
  profitLossPercent: number;
  maxDrawdown: number;
  sharpeRatio: number;
  returns: { date: string; value: number }[];
}

export interface AlgorithmOption {
  id: string;
  name: string;
  description: string;
  parameters: {
    [key: string]: {
      name: string;
      defaultValue: number;
      min: number;
      max: number;
      step: number;
    };
  };
}

export interface AlgorithmRunnerProps {
  stockData: any;
  symbol: string;
  timePeriod: string;
}
