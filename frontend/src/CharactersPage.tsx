import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import roleRevealedImg from "./assets/characters/role-revealed.png";
import beautifulMindImg from "./assets/characters/beautiful-mind.png";
import silenceImg from "./assets/characters/silence-of-the-lambs.png";
import handcuffsImg from "./assets/characters/handcuffs.png";
import redCarpetImg from "./assets/characters/red-carpet.png";
import finalShotImg from "./assets/characters/final-shot.png";
import faceOffImg from "./assets/characters/face-off.png";

const CharactersPage: React.FC = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
        margin: "24px 0 16px",
    };

    const cardsGrid: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        marginBottom: 40,
    };

    const roleCard: React.CSSProperties = {
        display: "flex",
        gap: 16,
        background: "#d6b170",
        color: "#000",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    };

    const charImgStyle: React.CSSProperties = {
        width: 110,
        maxWidth: 110,
        height: "auto",
        borderRadius: 12,
        objectFit: "contain",
        display: "block",
        flexShrink: 0,
    };

    const lastMoveCard: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap: 16,
        background: "#111",
        color: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
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

    return (
        <div style={pageStyle}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <button
                    onClick={() => navigate("/game")}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#e9e9e9",
                        cursor: "pointer",
                        fontSize: 14,
                    }}
                >
                    ← Back to Home
                </button>

                <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#e9e9e9",
                        cursor: "pointer",
                        fontSize: 16,
                    }}
                    aria-label="Open settings"
                >
                    Settings
                </button>
            </div>

            <h1 style={sectionTitle}>Role Overview</h1>

            {/* Roles */}
            <div style={cardsGrid}>
                {[
                    { img: godfatherImg, title: "God Father", side: "Mafia", desc: "Mafia’s leader and strategist — survives the first elimination attempt. May use the Silence of the Lambs card once per game to stop a player from speaking during the day. Wins if all Citizens are eliminated." },
                    { img: citizenImg, title: "Citizen", side: "Good", desc: "Armed with pitchforks, paranoia, and loud voices. Has no special powers. Votes during the day to eliminate suspected Mafia members. Wins when all Mafia are dead." },
                    { img: drWatsonImg, title: "Dr Watson", side: "Good", desc: "Each night, may protect one Citizen from the Mafia’s kill. Cannot protect the same person two nights in a row. If the protected person is targeted by the Mafia, they survive." },
                    { img: saulGoodmanImg, title: "Saul Goodman", side: "Mafia", desc: "If a Mafia member dies, Saul can recruit a new Mafia member once per game. Recruitment fails on special roles such as Leon or Dr Watson. A true con artist and negotiator." },
                    { img: leonImg, title: "Leon", side: "Good", desc: "Can shoot twice per game. If Leon kills a Mafia member, he survives. If he kills a Citizen, Leon dies instantly. A silent avenger who takes justice into his own hands." },
                    { img: constantineImg, title: "Constantine", side: "Good", desc: "May bring one dead player back to life once per game. The resurrected player returns as a Citizen regardless of their former role." },
                    { img: matadorImg, title: "Matador", side: "Mafia", desc: "Each night may block one powerful Citizen role (like Dr Watson or Leon) from performing their action. A master of disruption and chaos." },
                    { img: citizenKaneImg, title: "Citizen Kane", side: "Good", desc: "Once per game, may request a public investigation. The Game Master must reveal the loyalty (Mafia or Citizen) of a chosen player to everyone. If target is Citizen, nothing else happens." },
                    { img: nostradamusImg, title: "Nostradamus", side: "Neutral", desc: "Before the game begins, secretly selects a player. If that player dies during the first night, Nostradamus joins the Mafia. If not, he remains Neutral and wins if he survives to the end." },
                ].map((r) => (
                    <div key={r.title} style={roleCard}>
                        <img src={r.img} alt={r.title} style={charImgStyle} />
                        <div>
                            <h3 style={{ fontSize: 20, margin: "0 0 4px" }}>{r.title}</h3>
                            <span style={badgeStyle}>{r.side}</span>
                            <p style={{ fontSize: 13, lineHeight: 1.5 }}>{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={sectionTitle}>Last Move Cards</h2>

            <div style={cardsGrid}>
                {[
                    { img: roleRevealedImg, title: "Role Revealed", text: "Immediately reveals the true role of the chosen player to everyone in the game." },
                    { img: beautifulMindImg, title: "Beautiful Mind", text: "For one night, you can predict a player’s action and block it if correct." },
                    { img: silenceImg, title: "The silence of the lambs", text: "Blocks the chosen player from speaking during the next day phase." },
                    { img: handcuffsImg, title: "Handcuffs", text: "Chains a player and prevents them from taking any action on the next night." },
                    { img: redCarpetImg, title: "Red Carpet", text: "Forces a player to speak first during the next day’s discussion and voting." },
                    { img: finalShotImg, title: "Final Shot", text: "Take the last bullet: instantly kill one player of your choice before dying." },
                    { img: faceOffImg, title: "Face Off", text: "Reveal your own role and challenge another player to reveal theirs immediately." },
                ].map((c) => (
                    <div key={c.title} style={lastMoveCard}>
                        <img src={c.img} alt={c.title} style={charImgStyle} />
                        <div>
                            <h3 style={{ fontSize: 18, margin: "0 0 4px" }}>{c.title}</h3>
                            <p style={{ fontSize: 13, lineHeight: 1.5 }}>{c.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ maxWidth: 700, marginTop: 40 }}>
                <h2 style={sectionTitle}>Want to learn how to play?</h2>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#c9c9c9", marginBottom: 16 }}>
                    Mafia is a social deduction game of trust and deception. Some players are innocent Citizens,
                    others are secret Mafia members. The Mafia win by eliminating all the villagers. The villagers
                    win by discovering and eliminating all members of the Mafia before being outnumbered.
                </p>
                {/* Scroll up */}
                <button
                    onClick={() => {
                        window.scrollTo(0, 0);
                        navigate("/how-to-play");
                    }}
                    style={{
                        background: "#6c43f3",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 14,
                    }}
                >
                    Learn how to play
                </button>
            </div>

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
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
        </div>
    );
};

export default CharactersPage;
