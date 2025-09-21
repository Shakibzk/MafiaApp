import React, { useState, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsDrawer from "./components/SettingsDrawer";

const NameCharactersPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const total = state?.total || 0;
    const selectedCharacters: string[] = state?.characters || [];
    const lobbyId = state?.lobbyId;
    const hostName = state?.hostName || "";

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [names, setNames] = useState<string[]>(Array(total).fill(""));
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const prefix = useId();

    const pageStyle: React.CSSProperties = {
        backgroundColor: "#2f2f2f",
        minHeight: "100vh",
        color: "#e9e9e9",
        padding: "28px 24px 80px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
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

    const inputGrid: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        marginBottom: 24,
    };

    const inputBox: React.CSSProperties = {
        background: "#fff",
        color: "#000",
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 14,
        border: "1px solid #ccc",
        width: "100%",
    };

    const handleContinue = () => {
        const filled = names.filter((n) => n.trim() !== "");
        if (filled.length !== total) {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }
        // ✅ ارسال lobbyId
        navigate("/allocate", { state: { names, characters: selectedCharacters, lobbyId, hostName } });
    };

    return (
        <div style={pageStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "#e9e9e9", cursor: "pointer", fontSize: 14 }}>← Back</button>
                <button onClick={() => setDrawerOpen(true)} style={{ background: "transparent", border: "none", color: "#e9e9e9", cursor: "pointer", fontSize: 16 }}>Settings</button>
            </div>

            <div style={stepsRow}>
                {["Players", "Characters", "Names", "Allocate"].map((step, i) => (
                    <div key={step} style={{ textAlign: "center" }}>
                        <div style={stepDot(i === 2)} />
                        <span style={{ fontSize: 13 }}>{step}</span>
                    </div>
                ))}
            </div>

            <h1 style={sectionTitle}>Name your Characters</h1>
            <p style={subText}>List all the names of those you will invite to the game.</p>

            <div style={inputGrid}>
                {Array.from({ length: total }).map((_, idx) => (
                    <div key={`${prefix}-${idx}`} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <strong>Player {idx + 1}</strong>
                        <input
                            style={inputBox}
                            value={names[idx]}
                            onChange={(e) => {
                                const copy = [...names];
                                copy[idx] = e.target.value;
                                setNames(copy);
                            }}
                            placeholder="Write name here"
                        />
                    </div>
                ))}
            </div>

            {error && (
                <p style={{ color: "red", textAlign: "center", marginBottom: 12, fontSize: 14 }}>
                    Please enter a name for every player.
                </p>
            )}

            <div style={{ textAlign: "center", marginTop: 20 }}>
                <button
                    onClick={handleContinue}
                    style={{
                        background: "#6c43f3",
                        color: "#fff",
                        border: error ? "2px solid #e53935" : "2px solid transparent",
                        padding: "12px 48px",
                        borderRadius: 24,
                        cursor: "pointer",
                        fontSize: 16,
                        transition: "border 0.3s",
                        animation: shake ? "shake 0.4s" : "none",
                    }}
                >
                    Continue
                </button>
            </div>

            <style>{`
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-6px); }
                    50% { transform: translateX(6px); }
                    75% { transform: translateX(-6px); }
                    100% { transform: translateX(0); }
                }
            `}</style>

            <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSignOut={() => navigate("/")} />
        </div>
    );
};

export default NameCharactersPage;
