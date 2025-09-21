import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsDrawer from "./components/SettingsDrawer";

import godfatherImg from "./assets/characters/godfather.png";
import citizenImg from "./assets/characters/citizen.png";
import drWatsonImg from "./assets/characters/dr-watson.png";
import saulGoodmanImg from "./assets/characters/saul-goodman.png";
import leonImg from "./assets/characters/leon.png";
import constantineImg from "./assets/characters/constantine.png";
import matadorImg from "./assets/characters/matador.png";
import citizenKaneImg from "./assets/characters/citizen-kane.png";
import nostradamusImg from "./assets/characters/nostradamus.png";

const CharactersSelectPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lobbyId = location.state?.lobbyId;
    const hostName = location.state?.hostName || "";
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const changeCount = (name: string, delta: number) => {
        setCounts((prev) => {
            const current = prev[name] || 0;
            const max = name === "Citizen" ? 3 : 1;
            const next = Math.max(0, Math.min(max, current + delta));
            return { ...prev, [name]: next };
        });
    };

    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

    const handleContinue = () => {
        if (totalSelected < 6) {
            setError(true);
            const btn = document.getElementById("continue-btn");
            if (btn) {
                btn.classList.add("shake");
                setTimeout(() => btn.classList.remove("shake"), 350);
            }
            return;
        }
        const chosenCharacters: string[] = [];
        Object.entries(counts).forEach(([name, count]) => {
            for (let i = 0; i < count; i++) {
                chosenCharacters.push(i > 0 && name === "Citizen" ? `Citizen ${i}` : name);
            }
        });
        // ✅ پاس دادن lobbyId
        navigate("/name-characters", {
            state: { total: totalSelected, characters: chosenCharacters, lobbyId, hostName },
        });
    };

    const pageStyle: React.CSSProperties = {
        backgroundColor: "#2f2f2f",
        minHeight: "100vh",
        color: "#e9e9e9",
        padding: "28px 24px 80px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
    };

    const sectionTitle: React.CSSProperties = {
        fontSize: 28,
        fontWeight: 700,
        textAlign: "center",
        margin: "0 0 12px",
    };

    const subText: React.CSSProperties = {
        textAlign: "center",
        color: "#ccc",
        marginBottom: 40,
        fontSize: 15,
    };

    const stepsRow: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        gap: 40,
        margin: "20px 0 40px",
    };

    const stepDot = (active: boolean): React.CSSProperties => ({
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: active ? "#6c43f3" : "#fff",
        margin: "0 auto 6px",
    });

    const cardsGrid: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
    };

    const roleCard = (selected: boolean): React.CSSProperties => ({
        display: "flex",
        gap: 16,
        background: "#d6b170",
        color: "#000",
        borderRadius: 12,
        padding: 16,
        boxShadow: selected ? "0 0 0 3px #8d5bff" : "0 4px 12px rgba(0,0,0,0.3)",
        transform: selected ? "scale(1.02)" : "none",
        transition: "all 0.2s ease",
        flexDirection: "column",
        alignItems: "center",
    });

    const charImgStyle: React.CSSProperties = {
        width: 110,
        height: "auto",
        borderRadius: 12,
        objectFit: "contain",
        display: "block",
    };

    const badgeStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#000",
        color: "#fff",
        padding: "3px 8px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 6,
    };

    const counterStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f0e2",
        borderRadius: 12,
        padding: "6px 14px",
        marginTop: "auto",
        fontSize: 20,
        fontWeight: 500,
        gap: 12,
        border: "1px solid #d8cba8",
        minWidth: 100,
    };

    const characters = [
        { img: godfatherImg, title: "God Father", side: "Mafia", desc: "Wears a bulletproof vest — survives the first attempt on his life.\nMay use Sixth Sense instead of shooting; guess a player’s role.\nIf correct — that player is eliminated immediately." },
        { img: citizenImg, title: "Citizen", side: "Good", desc: "“Armed with pitchforks, paranoia, and bad guesses.”\nNo special powers. Votes by day." },
        { img: drWatsonImg, title: "Dr Watson", side: "Good", desc: "Each night, may protect one Citizen from the Mafia’s attack.\nMay protect himself only once per game.\nMay protect others any number of times." },
        { img: saulGoodmanImg, title: "Saul Goodman", side: "Mafia", desc: "If a Mafia member dies, may recruit a new Mafia.\nRecruitment only works on Citizens.\nIf targeting a powerful Citizen Doctor… recruitment fails.\nIf successful — that Citizen joins Mafia." },
        { img: leonImg, title: "Leon", side: "Good", desc: "Can shoot twice per game.\nIf Leon kills a Mafia — that Mafia is eliminated (except the Godfather, who requires two hits).\nIf Leon shoots a Citizen by mistake — Leon goes insane.\nWears a vest — survives the first hit." },
        { img: constantineImg, title: "Constantine", side: "Good", desc: "May bring one eliminated player back in the game (one time only)." },
        { img: matadorImg, title: "Matador", side: "Mafia", desc: "Each night may block one powerful Citizen’s ability.\nCannot block the same player two nights in a row.\nExample: Block A — next night must block B — can block A again afterward." },
        { img: citizenKaneImg, title: "Citizen Kane", side: "Good", desc: "Once per game, may inquire about one player’s role.\nIf target is Mafia — revealed publicly next morning.\nIf target is Citizen — nothing happens.\nIf target is Godfather — result always appears as “Citizen.”" },
        { img: nostradamusImg, title: "Nostradamus", side: "Neutral", desc: "At the beginning, selects 3 players — learns how many of them are Mafia.\nThen chooses which side to join.\nSpecial Rules:\n• If the Godfather is among the 3 — not revealed.\n• Cannot be killed at night unless: Citizens vote to eliminate him, or the Godfather uses Sixth Sense." }
    ];

    return (
        <div style={pageStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "#e9e9e9", cursor: "pointer", fontSize: 14 }}>← Back</button>
                <button onClick={() => setDrawerOpen(true)} style={{ background: "transparent", border: "none", color: "#e9e9e9", cursor: "pointer", fontSize: 16 }}>Settings</button>
            </div>

            <div style={stepsRow}>
                {["Players", "Characters", "Names", "Allocate"].map((step, i) => (
                    <div key={step} style={{ textAlign: "center" }}>
                        <div style={stepDot(i === 1)} />
                        <span style={{ fontSize: 13 }}>{step}</span>
                    </div>
                ))}
            </div>

            <h1 style={sectionTitle}>Choose your Characters</h1>
            <p style={subText}>We have preselected roles based on your group size. You can change the composition anytime you like.</p>

            <div style={cardsGrid}>
                {characters.map((c) => {
                    const selected = (counts[c.title] || 0) > 0;
                    return (
                        <div key={c.title} style={roleCard(selected)}>
                            <img src={c.img} alt={c.title} style={charImgStyle} />
                            <div style={{ textAlign: "center" }}>
                                <h3 style={{ fontSize: 20, margin: "8px 0 4px" }}>{c.title}</h3>
                                <span style={badgeStyle}>{c.side}</span>
                                <p style={{ fontSize: 13, lineHeight: 1.4, textAlign: "left", whiteSpace: "pre-line" }}>{c.desc}</p>
                            </div>
                            <div style={{ height: 4 }} />
                            <div style={counterStyle}>
                                <button onClick={() => changeCount(c.title, -1)} style={{ background: "transparent", border: "none", fontSize: 22, cursor: "pointer" }}>–</button>
                                <span>{counts[c.title] || 0}</span>
                                <button onClick={() => changeCount(c.title, 1)} style={{ background: "transparent", border: "none", fontSize: 22, cursor: "pointer" }}>+</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ textAlign: "center", marginTop: 40 }}>
                {error && <p style={{ color: "red", marginBottom: 8, fontSize: 14 }}>You must select at least 6 characters to proceed.</p>}
                <button
                    id="continue-btn"
                    onClick={handleContinue}
                    style={{
                        background: "#6c43f3",
                        color: "#fff",
                        border: error ? "2px solid red" : "none",
                        padding: "12px 48px",
                        borderRadius: 24,
                        cursor: "pointer",
                        fontSize: 16,
                    }}
                >
                    Continue
                </button>
            </div>

            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{
                        position: "fixed",
                        bottom: 24,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6c43f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        fontSize: 24,
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                    }}
                >
                    ↑
                </button>
            )}

            <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSignOut={() => navigate("/")} />

            <style>{`
                @keyframes shakeAnim {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-6px); }
                    50% { transform: translateX(6px); }
                    75% { transform: translateX(-6px); }
                    100% { transform: translateX(0); }
                }
                .shake { animation: shakeAnim 0.35s; }
            `}</style>
        </div>
    );
};

export default CharactersSelectPage;
