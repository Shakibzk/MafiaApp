import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsDrawer from "./components/SettingsDrawer";

const PlayerCountPage: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [count, setCount] = useState(6);
    const navigate = useNavigate();
    const location = useLocation();
    const lobbyId = location.state?.lobbyId;
    const hostName = location.state?.hostName || "";

    const colors = {
        bg: "#2f2f2f",
        text: "#ffffff",
        textMuted: "#ccc",
        purple: "#6c43f3",
    };

    return (
        <div style={{
            background: colors.bg,
            minHeight: "100vh",
            color: colors.text,
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: colors.text,
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    ← Back to Home
                </button>

                <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: colors.text,
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    Settings
                </button>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                margin: "20px 0 60px",
            }}>
                {["Players", "Characters", "Names", "Allocate"].map((step, i) => (
                    <div key={step} style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: i === 0 ? colors.purple : "#fff",
                                margin: "0 auto 6px",
                            }}
                        />
                        <span style={{ fontSize: 13 }}>{step}</span>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: "center", flexGrow: 1 }}>
                <h2 style={{ fontSize: 28, marginBottom: 12 }}>How many players</h2>
                <p style={{ color: colors.textMuted, marginBottom: 28 }}>
                    There must be at least 6 players. The more players, the more exciting the game becomes.
                </p>

                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    marginBottom: 40,
                }}>
                    <button
                        onClick={() => setCount(Math.max(6, count - 1))}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: 20,
                            cursor: "pointer",
                            padding: "0 12px",
                        }}
                        aria-label="Decrease players"
                    >
                        –
                    </button>
                    <span style={{ fontSize: 20, minWidth: 40, textAlign: "center" }}>{count}</span>
                    <button
                        onClick={() => setCount(Math.min(11, count + 1))}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: 20,
                            cursor: "pointer",
                            padding: "0 12px",
                        }}
                        aria-label="Increase players"
                    >
                        +
                    </button>
                </div>

                <div>
                    <button
                        style={{
                            background: colors.purple,
                            color: "#fff",
                            border: "none",
                            borderRadius: 24,
                            padding: "12px 48px",
                            fontSize: 16,
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            navigate("/choose-characters", { state: { lobbyId, hostName, count } }) // ✅ پاس‌دادن lobbyId
                        }
                    >
                        Continue
                    </button>
                </div>
            </div>

            <SettingsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSignOut={() => {}}
            />
        </div>
    );
};

export default PlayerCountPage;
