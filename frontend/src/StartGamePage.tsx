import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsDrawer from "./components/SettingsDrawer";
import appLogo from "./assets/app-logo.png";

type MeResponse =
    | { authenticated: false }
    | {
    authenticated: true;
    user: { firstName?: string | null; username?: string | null; avatarUrl?: string | null };
};

type PlayerByCodeResponse = {
    username: string;
    role: string;
    lobbyId: string;
};

const StartGamePage: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [currentName, setCurrentName] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/user", { credentials: "include" });
                const data: MeResponse = await res.json();
                if (data?.authenticated) {
                    setCurrentName(data.user.firstName || data.user.username || "");
                    setAvatarUrl(data.user.avatarUrl ?? null);
                }
            } catch {
                console.error("Failed to fetch user info");
            }
        })();
    }, []);

    const initials = (currentName || "").trim().slice(0, 1).toUpperCase();

    const joinWithCode = async () => {
        setErrorMsg("");
        const code = joinCode.trim();
        if (!code) {
            setErrorMsg("Please enter a code first.");
            return;
        }
        try {
            const res = await fetch(`/api/lobbies/playerByCode/${code}`);
            if (!res.ok) {
                setErrorMsg("Invalid or expired code. Try again.");
                return;
            }
            const player: PlayerByCodeResponse = await res.json();
            navigate("/join-lobby", {
                state: {
                    username: player.username,
                    role: player.role,
                    roleName: player.role,
                    lobbyId: player.lobbyId,
                    playerCode: code,
                },
            });
        } catch {
            setErrorMsg("Unable to connect to server. Please try later.");
        }
    };

    const createGameAndLobby = async () => {
        try {
            // ⬅️ ساخت لابی جدید و گرفتن lobbyId
            const res = await fetch("/api/lobbies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameId: "" }),
            });
            if (!res.ok) throw new Error("Failed to create lobby");
            const lobby: { id: string } = await res.json();
            navigate("/player-count", {
                state: { hostName: currentName, lobbyId: lobby.id },
            });
        } catch (e) {
            console.error("Error creating lobby", e);
            setErrorMsg("Could not create a new lobby. Try again.");
        }
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        textAlign: "left",
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 6,
        color: "#fff",
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px 14px",
        marginBottom: 18,
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.5)",
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: 15,
        outline: "none",
        boxSizing: "border-box",
    };

    const buttonStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 0",
        backgroundColor: "#6c43f3",
        border: "none",
        borderRadius: 24,
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
    };

    const sectionStyle: React.CSSProperties = {
        flex: 1,
        padding: "40px 40px",
        boxSizing: "border-box",
        textAlign: "center",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundImage: "url('/game-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontFamily: "system-ui, sans-serif",
                padding: "24px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 40,
                }}
            >
                <img src={appLogo} alt="Mafia Logo" style={{ width: 60, height: 60 }} />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "white",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    <span
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            overflow: "hidden",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.2)",
                            border: "1px solid rgba(255,255,255,0.35)",
                        }}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                referrerPolicy="no-referrer"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: 12, fontWeight: 700 }}>
                                {initials || "?"}
                            </span>
                        )}
                    </span>
                    <span>{currentName || "Player"}</span>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: 16,
                        }}
                    >
                        Settings
                    </button>
                </div>
            </div>

            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "90%",
                        maxWidth: 1100,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxSizing: "border-box",
                        alignItems: "stretch",
                        position: "relative",
                    }}
                >
                    <div style={sectionStyle}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                            Host a Game
                        </h1>
                        <p style={{ fontSize: 15, color: "#ccc", marginBottom: 24 }}>
                            Welcome {currentName || "Player"}! Start a game and invite friends.
                        </p>
                        <button
                            style={buttonStyle}
                            onClick={createGameAndLobby}
                        >
                            Create Game
                        </button>
                    </div>

                    <div
                        style={{
                            width: 1,
                            backgroundColor: "rgba(255,255,255,0.4)",
                            marginTop: 30,
                            marginBottom: 30,
                        }}
                    />

                    <div style={sectionStyle}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                            Join a Game
                        </h1>
                        <p style={{ fontSize: 15, color: "#ccc", marginBottom: 24 }}>
                            Got an invite? Enter the code to join your friends.
                        </p>
                        <label htmlFor="joinCode" style={labelStyle}>
                            Code
                        </label>
                        <input
                            id="joinCode"
                            placeholder="Enter code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            style={inputStyle}
                        />
                        {errorMsg && (
                            <p style={{ color: "red", marginBottom: 12, fontSize: 14 }}>
                                {errorMsg}
                            </p>
                        )}
                        <button style={buttonStyle} onClick={joinWithCode}>
                            Join
                        </button>
                    </div>
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

export default StartGamePage;
