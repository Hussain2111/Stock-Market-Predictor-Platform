import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import AnalysisPage from "./analysis";
import Trading from "./Trading";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/trade" element={<Trading />} />
      </Routes>
    </Router>
  );
}

export default App;
