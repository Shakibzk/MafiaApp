import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AgbPage from "./AgbPage";
import GameMenuPage from "./GameMenuPage";
import HowToPlayPage from "./HowToPlayPage";

function App() {
    return (
        <div style={{ minHeight: "100vh" }}> {/* ✅ بجای height:100% */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/agb" element={<AgbPage />} />
                    <Route path="/game" element={<GameMenuPage />} />
                    <Route path="/how-to-play" element={<HowToPlayPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
