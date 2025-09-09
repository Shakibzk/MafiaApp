import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AgbPage from "./AgbPage";
import GameMenuPage from "./GameMenuPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* مسیر /welcome حذف شد */}
                <Route path="/agb" element={<AgbPage />} />
                <Route path="/game" element={<GameMenuPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
