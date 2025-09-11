import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import drWatsonImg from "./assets/characters/dr-watson.png";
import saulGoodmanImg from "./assets/characters/saul-goodman.png";
import SettingsDrawer from "./components/SettingsDrawer";

const HowToPlayPage: React.FC = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }
        localStorage.removeItem("username");
        navigate("/");
    };

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 200);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const colors = {
        bg: "#2f2f2f",
        text: "#e9e9e9",
        textMuted: "#c9c9c9",
        card: "#e6c678",
        purple: "#6c43f3",
    };

    const pageStyle: React.CSSProperties = {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: colors.bg,
        color: colors.text,
        boxSizing: "border-box",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: 900,
        margin: "0 auto",
        padding: "28px 24px 80px",
    };

    const headerRowStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    };

    const linkBtn: React.CSSProperties = {
        background: "transparent",
        border: "none",
        color: colors.text,
        cursor: "pointer",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: 0,
    };

    const h2Style: React.CSSProperties = { fontSize: 22, margin: "18px 0 10px" };
    const h3Style: React.CSSProperties = { fontSize: 16, margin: "16px 0 6px" };
    const pStyle: React.CSSProperties = {
        fontSize: 12.5,
        lineHeight: 1.6,
        color: colors.textMuted,
        margin: "0 0 18px",
        maxWidth: 560,
    };

    const ulStyle: React.CSSProperties = {
        margin: "0 0 12px 18px",
        padding: 0,
        color: colors.textMuted,
        fontSize: 12.5,
        lineHeight: 1.5,
        maxWidth: 620,
    };

    const olStyle: React.CSSProperties = {
        margin: "0 0 24px 18px",
        padding: 0,
        color: colors.textMuted,
        fontSize: 12.5,
        lineHeight: 1.5,
        maxWidth: 640,
    };

    const charactersRow: React.CSSProperties = {
        display: "flex",
        justifyContent: "flex-start",
        gap: 24,
        marginBottom: 26,
        flexWrap: "wrap",
    };

    const cardStyle: React.CSSProperties = {
        width: 360,
        background: colors.card,
        borderRadius: 12,
        padding: "20px 20px 20px 25px",
        display: "flex",
        gap: 16,
        color: "black",
    };

    const learnBtn: React.CSSProperties = {
        background: colors.purple,
        border: "none",
        color: "white",
        padding: "10px 20px",
        borderRadius: 8,
        cursor: "pointer",
        margin: "0 0 32px",
        fontSize: 14,
    };

    const scrollTopBtn: React.CSSProperties = {
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: colors.purple,
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: 50,
        height: 50,
        fontSize: 22,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                {/* Back + Settings */}
                <div style={headerRowStyle}>
                    <button onClick={() => navigate("/game")} style={linkBtn} aria-label="Back to Home">
                        <span aria-hidden>←</span>
                        <span>Back to Home</span>
                    </button>

                    <button onClick={() => setDrawerOpen(true)} style={linkBtn} aria-label="Open Settings">
                        <span aria-hidden>⚙</span>
                        <span>Settings</span>
                    </button>
                </div>

                {/* Intro */}
                <h2 style={h2Style}>Intro</h2>
                <p style={pStyle}>
                    Mafia is a social deduction game of trust and deception. Some players are innocent villagers, others are
                    secret Mafia members. The Mafia win by eliminating villagers. The villagers win by finding and eliminating
                    the Mafia.
                </p>

                {/* How to play */}
                <h2 style={h2Style}>How to play</h2>

                <h3 style={h3Style}>The Setup:</h3>
                <ul style={ulStyle}>
                    <li>Everyone gets a secret role: you’re either a Citizen (the good guys) or part of the Mafia (the killers).</li>
                    <li>A few players get special powers (Doctor, Detective, etc.) that help their side.</li>
                </ul>

                <h3 style={h3Style}>The Goal:</h3>
                <ul style={ulStyle}>
                    <li>Citizens win → if they eliminate all Mafia.</li>
                    <li>Mafia wins → if they outnumber the Citizens.</li>
                </ul>

                <h3 style={h3Style}>The Game Flow:</h3>
                <ol style={olStyle}>
                    <li>
                        <b>Night (in secret 🌙)</b>
                        <ol style={{ ...ulStyle, listStyleType: "lower-alpha", marginTop: 6 }}>
                            <li>Mafia secretly choose one player to kill.</li>
                            <li>Special roles (Doctor, Detective, etc.) secretly use their powers.</li>
                            <li>Everyone else “sleeps”.</li>
                        </ol>
                    </li>
                    <li>
                        <b>Day (in public 🌞)</b>
                        <ol style={{ ...ulStyle, listStyleType: "lower-alpha", marginTop: 6 }}>
                            <li>The Host announces who died last night.</li>
                            <li>Everyone talks, accuses, and tries to figure out who’s Mafia.</li>
                            <li>Players can bluff, lie, defend themselves — anything goes.</li>
                        </ol>
                    </li>
                    <li>
                        <b>Voting (⚖️)</b>
                        <ol style={{ ...ulStyle, listStyleType: "lower-alpha", marginTop: 6 }}>
                            <li>Everyone votes on one player to eliminate.</li>
                            <li>That player’s role is revealed.</li>
                        </ol>
                    </li>
                    <li>
                        <b>Repeat</b> until one side wins.
                    </li>
                </ol>

                {/* Characters */}
                <h2 style={h2Style}>Characters</h2>
                <div style={charactersRow}>
                    <div style={cardStyle}>
                        <img
                            src={drWatsonImg}
                            alt="Dr Watson"
                            style={{ width: 120, height: "auto", borderRadius: 8, objectFit: "contain" }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>
                                Dr Watson <span style={{ color: "green", fontSize: 14, display: "block" }}>Good</span>
                            </h3>
                            <p style={{ fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
                                Each night, may protect one Citizen from the Mafia’s attack.
                                <br /><br />
                                May protect himself only once per game.
                                <br /><br />
                                May protect others any number of times.
                            </p>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <img
                            src={saulGoodmanImg}
                            alt="Saul Goodman"
                            style={{ width: 120, height: "auto", borderRadius: 8, objectFit: "contain" }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>
                                Saul Goodman <span style={{ color: "red", fontSize: 14, display: "block" }}>Mafia</span>
                            </h3>
                            <p style={{ fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
                                If a Mafia member dies, may recruit a new Mafia.
                                <br /><br />
                                Recruitment only works on Citizens.
                                <br /><br />
                                If targeting a powerful Citizen (Doctor, Detective, etc.) → recruitment fails.
                                <br /><br />
                                If successful → that Citizen joins the Mafia.
                            </p>
                        </div>
                    </div>
                </div>

                <h3 style={{ ...h3Style, marginBottom: 8 }}>Want to meet all the characters?</h3>
                <p style={{ ...pStyle, maxWidth: 680, marginBottom: 12 }}>
                    Mafia is a social deduction game of trust and deception. Some players are innocent villagers, others are
                    secret Mafia members. The Mafia win by eliminating villagers. The villagers win by finding and eliminating
                    the Mafia.
                </p>

                {/* Scroll up*/}
                <button
                    style={learnBtn}
                    onClick={() => {
                        window.scrollTo(0, 0);
                        navigate("/characters");
                    }}
                >
                    Learn about the characters
                </button>

                <h2 style={h2Style}>Script for Host</h2>
                <p style={{ ...pStyle, whiteSpace: "pre-line", maxWidth: 700, color: colors.textMuted }}>
                    {"\"Welcome to our city… a city of shadows, smoke, and secrets. On the surface, it’s business as usual: "}
                    {"Citizens walk the streets, the papers sell their stories, and the bar stays open late. But in the alleys "}
                    {"and speakeasies… the Mafia lurks. They smile, they shake your hand, and when the night falls, they strike.\""}
                    {"\n\n"}
                    Every one of you has a role to play. Some of you are honest Citizens, trying to survive and bring justice.
                    Others wear darker suits… the Mafia, blending in, plotting your end. A few of you hold special powers — a
                    Doctor who heals, a Detective who seeks the truth, a Godfather who commands respect, and stranger figures
                    whose motives are… less clear.
                    {"\n\n"}
                    The game moves in two parts. At night, the city sleeps. The Mafia meet in secret, choosing who won’t live
                    to see the dawn. Special roles stir in the dark, using their powers unseen. Then comes the day. The city
                    wakes to find another body on the ground… and the whispers begin. Who is lying? Who can you trust? You talk,
                    you argue, you accuse — and in the end, you vote. One among you will face the crowd, and their mask will fall.
                    {"\n\n"}
                    This continues — night, then day, then vote — until one side remains. Either the Citizens rid themselves of
                    crime… or the Mafia take control of the city. So light your last cigarette, pour a stiff drink, and remember:
                    in this city, trust is a luxury, and the mask will fall.
                </p>

                <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSignOut={handleSignOut} />
            </div>

            {showScrollTop && (
                <button onClick={scrollToTop} style={scrollTopBtn} aria-label="Scroll to top">
                    ↑
                </button>
            )}
        </div>
    );
};

export default HowToPlayPage;
