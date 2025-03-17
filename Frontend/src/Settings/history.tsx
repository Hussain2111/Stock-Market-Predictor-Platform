import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface AnalysisHistoryItem {
  id: string;
    ticker: string;
    date: string;
    prediction: string;
    accuracy: string;
}

interface HistoryProps {
  activeTab: string;
  analysisHistory: AnalysisHistoryItem[];
  //setanalysisHistory: React.Dispatch<React.SetStateAction<AnalysisHistoryItem[]>>;
}

const History = ({activeTab, analysisHistory, }: HistoryProps) => {
    return (
        <>
        {activeTab === "history" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Analysis History</h2>
                    <button className="flex items-center text-emerald-400 hover:text-emerald-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-4 px-2">Ticker</th>
                          <th className="text-left py-4 px-2">Date</th>
                          <th className="text-left py-4 px-2">Prediction</th>
                          <th className="text-left py-4 px-2">Accuracy</th>
                          <th className="text-right py-4 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisHistory.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-800 hover:bg-white/5"
                          >
                            <td className="py-4 px-2 font-medium">
                              {item.ticker}
                            </td>
                            <td className="py-4 px-2 text-gray-400">
                              {item.date}
                            </td>
                            <td
                              className={`py-4 px-2 ${
                                item.prediction.startsWith("+")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item.prediction}
                            </td>
                            <td className="py-4 px-2">{item.accuracy}</td>
                            <td className="py-4 px-2 text-right">
                              <button className="text-emerald-400 hover:text-emerald-300">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
        </>
        )
}

export default History;