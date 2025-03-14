import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import AnalysisPage from "./analysis";
import Trading from "./Trading";
import Account from "./setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/trade" element={<Trading />} />
        <Route path="/settings" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;