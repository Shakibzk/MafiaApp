import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsDrawer from "./components/SettingsDrawer";

type LobbyPlayer = { username: string; role: string; inviteCode: string };

const AllocatePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { names = [], characters = [], lobbyId } = location.state || {};

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [randomMode, setRandomMode] = useState(true);
    const [selectedChars, setSelectedChars] = useState<Record<string, string>>({});
    const [assigned, setAssigned] = useState<string[]>([]);

    const takenCharacters = new Set(Object.values(selectedChars).filter(Boolean));

    const shuffleCharacters = () => {
        const shuffled = [...characters]
            .sort(() => Math.random() - 0.5)
            .slice(0, names.length);
        setAssigned(shuffled);
    };

    useEffect(() => {
        if (randomMode) shuffleCharacters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [randomMode, names.length]);

    const pageStyle: React.CSSProperties = {
        backgroundColor: "#2f2f2f",
        minHeight: "100vh",
        color: "#e9e9e9",
        padding: "28px 24px 80px",
        fontFamily: "system-ui, sans-serif",
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

    const pairsGrid: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        justifyItems: "center",
        margin: "0 200px 30px 200px",
    };

    const pairBox: React.CSSProperties = {
        background: "#fff",
        color: "#000",
        padding: "12px 16px",
        borderRadius: 12,
        width: "100%",
        maxWidth: 220,
        textAlign: "center",
        fontSize: 16,
        fontWeight: 500,
    };

    const shuffleBtn: React.CSSProperties = {
        background: "transparent",
        border: "1px solid #aaa",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 8,
        cursor: "pointer",
        marginBottom: 30,
    };

    const startBtn: React.CSSProperties = {
        background: "#6c43f3",
        color: "#fff",
        border: "none",
        padding: "12px 48px",
        borderRadius: 24,
        cursor: "pointer",
        fontSize: 16,
        display: "block",
        margin: "0 auto",
    };

    const startGame = async (): Promise<void> => {
        try {
            await Promise.all(
                names.map((n: string, i: number) =>
                    fetch(`/api/lobbies/${lobbyId}/join`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: n,
                            role: randomMode ? assigned[i] : selectedChars[n],
                        }),
                    }).then(res => {
                        if (!res.ok) {
                            throw new Error(`Join failed for ${n}`);
                        }
                        return res.json();
                    })
                )
            );

            const res = await fetch(`/api/lobbies/${lobbyId}`);
            if (!res.ok) throw new Error("Failed to fetch lobby");
            const lobby: { players: LobbyPlayer[] } = await res.json();

            navigate("/lobby", {
                state: {
                    lobbyId,
                    players: lobby.players.map((p) => ({
                        name: p.username,
                        role: p.role,
                        inviteCode: p.inviteCode,
                    })),
                },
            });
        } catch (err) {
            console.error("Failed to add players", err);
        }
    };

    return (
        <div style={pageStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: "transparent", border: "none", color: "#e9e9e9", cursor: "pointer", fontSize: 14 }}
                >
                    ← Zurück
                </button>
                <button
                    onClick={() => setDrawerOpen(true)}
                    style={{ background: "transparent", border: "none", color: "#e9e9e9", cursor: "pointer", fontSize: 16 }}
                >
                    Settings
                </button>
            </div>

            <div style={stepsRow}>
                {["Players", "Characters", "Names", "Allocate"].map((step, i) => (
                    <div key={step} style={{ textAlign: "center" }}>
                        <div style={stepDot(i === 3)} />
                        <span style={{ fontSize: 13 }}>{step}</span>
                    </div>
                ))}
            </div>

            <h1 style={sectionTitle}>Allocating your players</h1>
            <p style={subText}>
                Would you like to play god and choose who plays whom?
                <br />
                Or let fate decide?
            </p>

            <div style={{ textAlign: "center", marginBottom: 30 }}>
                <label style={{ display: "block", marginBottom: 10 }}>
                    <input
                        type="radio"
                        checked={!randomMode}
                        onChange={() => setRandomMode(false)}
                        style={{ marginRight: 8 }}
                    />
                    <span>Choose who plays whom</span>
                </label>
                <label style={{ display: "block", marginTop: 10 }}>
                    <input
                        type="radio"
                        checked={randomMode}
                        onChange={() => setRandomMode(true)}
                        style={{ marginRight: 8 }}
                    />
                    <span>Random Allocation</span>
                </label>
            </div>

            <div style={pairsGrid}>
                {names.map((name: string) => (
                    <div key={name} style={pairBox}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>{name}</div>

                        {!randomMode ? (
                            <select
                                style={{
                                    marginTop: 8,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #ccc",
                                    width: "100%",
                                }}
                                value={selectedChars[name] || ""}
                                onChange={(e) =>
                                    setSelectedChars({ ...selectedChars, [name]: e.target.value })
                                }
                            >
                                <option value="">Choose their character</option>
                                {characters.map((c: string) => (
                                    <option
                                        key={c}
                                        value={c}
                                        disabled={takenCharacters.has(c) && selectedChars[name] !== c}
                                        style={
                                            takenCharacters.has(c) && selectedChars[name] !== c
                                                ? { color: "#999" }
                                                : {}
                                        }
                                    >
                                        {c}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div style={{ marginTop: 8 }}>
                                {assigned[names.indexOf(name)] || "—"}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {randomMode && (
                <div style={{ textAlign: "center" }}>
                    <button style={shuffleBtn} onClick={shuffleCharacters}>
                        ⟳ Shuffle Characters
                    </button>
                </div>
            )}

            <button
                style={startBtn}
                onClick={startGame}
            >
                Start the Game
            </button>

            <SettingsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSignOut={() => navigate("/")}
            />
        </div>
    );
};

export default AllocatePage;
