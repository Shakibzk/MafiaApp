import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AgbPage from "./AgbPage";
import GameMenuPage from "./GameMenuPage";
import HowToPlayPage from "./HowToPlayPage";
import CharactersPage from "./CharactersPage";
import StartGamePage from "./StartGamePage";
import PlayerCountPage from "./PlayerCountPage";
import CharactersSelectPage from "./CharactersSelectPage";
import NameCharactersPage from "./NameCharactersPage";
import AllocatePage from "./AllocatePage";
import LobbyPage from "./pages/LobbyPage";
import JoinLobbyPage from "./pages/JoinLobbyPage.tsx";
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
                <Route path="/start-game" element={<StartGamePage />} />
                <Route path="/player-count" element={<PlayerCountPage />} />
                <Route path="/choose-characters" element={<CharactersSelectPage />} />
                <Route path="/name-characters" element={<NameCharactersPage />} />
                <Route path="/allocate" element={<AllocatePage />} />
                <Route path="/lobby" element={<LobbyPage />} />
                <Route path="/join-lobby" element={<JoinLobbyPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
