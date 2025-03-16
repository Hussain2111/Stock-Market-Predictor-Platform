import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import AnalysisPage from "./analysis";
import Trading from "./Trading";
import Account from "./setting";
import Portfolio from "./Portfolio";
import { PredictionProvider } from "./context/PredictionContext";

function App() {
  return (
    <PredictionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/trade" element={<Trading />} />
          <Route path="/settings" element={<Account />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Router>
    </PredictionProvider>
  );
}

export default App;
