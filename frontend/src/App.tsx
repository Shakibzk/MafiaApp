import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import WelcomePage from "./WelcomePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/welcome" element={<WelcomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
