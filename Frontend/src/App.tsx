import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import AnalysisPage from "./analysis";
import Trading from "./Trading";
import Settings from "./Settings/setting";
import Portfolio from "./Portfolio";
import Watchlist from "./Watchlist";
import { PredictionProvider } from "./context/PredictionContext";

function App() {
  return (
    <PredictionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/trade" element={<Trading />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Router>
    </PredictionProvider>
  );
}

export default App;
