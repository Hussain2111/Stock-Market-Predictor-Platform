
import { BrowserRouter as Router, Routes, Route }
    from "react-router-dom";
import Home from "./Home";
import Analysis from "./analysis";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home"
                    element={<Home />} />
                <Route path="/analysis"
                    element={<Analysis />} />
            </Routes>
        </Router>
    );
}

export default App;
