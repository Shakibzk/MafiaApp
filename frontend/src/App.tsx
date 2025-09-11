import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AgbPage from "./AgbPage";
import GameMenuPage from "./GameMenuPage";
import HowToPlayPage from "./HowToPlayPage";
import CharactersPage from "./CharactersPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/agb" element={<AgbPage />} />
                <Route path="/game" element={<GameMenuPage />} />
                <Route path="/how-to-play" element={<HowToPlayPage />} />
                <Route path="/characters" element={<CharactersPage />} />
            </Routes>
        </Router>
    );
};

export default App;
