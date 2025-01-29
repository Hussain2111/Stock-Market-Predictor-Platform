import { BrowserRouter as Router, Routes, Route }
    from "react-router-dom";
import HomePage from "./Home";
import AnalysisPage from "./Analysis";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
            </Routes>
        </Router>
    );
}

export default App;
