import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AgbPage from "./AgbPage";
import GameMenuPage from "./GameMenuPage";
import HowToPlayPage from "./HowToPlayPage";
import CharactersPage from "./CharactersPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/agb" element={<AgbPage />} />
                <Route path="/game" element={<GameMenuPage />} />
                <Route path="/how-to-play" element={<HowToPlayPage />} />
                <Route path="/characters" element={<CharactersPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
