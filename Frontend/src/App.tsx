import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import AnalysisPage from "./analysis";
import Trading from "./Trading";
import Settings from "./Settings/setting";
import Portfolio from "./Portfolio";
import Watchlist from "./Watchlist";
import { PredictionProvider } from "./components/context/PredictionContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import ProtectedWatchlist from "./ProtectedWatchlist";
import ProtectedPortfolio from "./ProtectedPortfolio";
import ProtectedSettings from "./ProtectedSettings";

function App() {
  return (
    <PredictionProvider>
      <WatchlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/trade" element={<Trading />} />
            <Route path="/settings" element={
              <ProtectedSettings>
                <Settings />
              </ProtectedSettings>
            } />
            <Route path="/portfolio" element={
              <ProtectedPortfolio>
                <Portfolio />
              </ProtectedPortfolio>
            } />
            <Route path="/watchlist" element={
              <ProtectedWatchlist>
                <Watchlist />
              </ProtectedWatchlist>
            } />
          </Routes>
        </Router>
      </WatchlistProvider>
    </PredictionProvider>
  );
}

export default App;
