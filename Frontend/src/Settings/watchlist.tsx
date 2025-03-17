import { motion } from "framer-motion";
import { X } from "lucide-react";

interface WatchlistProps {
  activeTab: string;
  savedTickers: string[];
  setSavedTickers: React.Dispatch<React.SetStateAction<string[]>>;
}

const Watchlist = ({ activeTab, savedTickers, setSavedTickers }: WatchlistProps) => {
  const removeTicker = (ticker: string) => {
    setSavedTickers(savedTickers.filter((t) => t !== ticker));
  };

  return (
    <>
      {activeTab === "watchlist" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
          
          <div className="space-y-4">
            {savedTickers.map((ticker) => (
              <div 
                key={ticker}
                className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="font-medium">{ticker}</div>
                <div>
                  <button 
                    className="px-4 py-2 bg-emerald-500 rounded-lg mr-2 text-sm hover:bg-emerald-600 transition-colors"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => removeTicker(ticker)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Watchlist;