import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import appLogo from "./assets/app-logo.png";

type MeResponse =
    | { authenticated: false }
    | {
    authenticated: true;
    user: { firstName?: string | null; username?: string | null; avatarUrl?: string | null };
};

const GameMenuPage: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/user", { credentials: "include" });
                const data: MeResponse = await res.json();
                if (data && "authenticated" in data && data.authenticated) {
                    setFirstName(data.user.firstName ?? null);
                    setAvatarUrl(data.user.avatarUrl ?? null);
                } else {
                    setFirstName(null);
                    setAvatarUrl(null);
                }
            } catch {
                setFirstName(null);
                setAvatarUrl(null);
            }
        })();
    }, []);

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

    const handleGoHome = () => {
        navigate("/game");
        setDrawerOpen(false);
    };

    const initials = (firstName || "").trim().slice(0, 1).toUpperCase();

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundImage: "url('/game-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <img src={appLogo} alt="Mafia Logo" style={{ width: 50, height: 50 }} />

                <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                    aria-label="Open settings"
                    type="button"
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
              aria-hidden="true"
          >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                />
            ) : (
                <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{initials || "?"}</span>
            )}
          </span>
                    <span>Settings{firstName ? ` • ${firstName}` : ""}</span>
                </button>
            </div>

            {/* Title + main buttons */}
            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                <h1
                    style={{
                        fontSize: "clamp(22px, 5vw, 36px)",
                        color: "white",
                        textShadow: "0 4px 12px rgba(0,0,0,0.7)",
                        textAlign: "center",
                    }}
                >
                    Shall we play Mafia?
                </h1>

                <div
                    className="menu-buttons"
                    style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}
                >
                    <button className="btn btn-primary" type="button">
                        Start Game
                    </button>
                    <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => navigate("/how-to-play")}
                    >
                        How to play
                    </button>
                    <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => navigate("/characters")}
                    >
                        Characters
                    </button>
                </div>
            </div>

            {drawerOpen && (
                <dialog open className="drawer-dialog" aria-modal="true" aria-labelledby="drawer-title">
                    <aside className="drawer-panel">
                        <button
                            className="drawer-close-btn"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close settings"
                            type="button"
                        >
                            ×
                        </button>

                        <nav aria-label="Settings menu" className="drawer-nav">
                            <h2 id="drawer-title" className="sr-only">
                                Settings
                            </h2>
                            <ul className="drawer-list">
                                <li>
                                    <button type="button" className="drawer-link" onClick={handleGoHome}>
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className="drawer-link"
                                        onClick={() => {
                                            navigate("/how-to-play");
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        How to play
                                    </button>
                                </li>
                                {/* Characters Menu */}
                                <li>
                                    <button
                                        type="button"
                                        className="drawer-link"
                                        onClick={() => {
                                            navigate("/characters");
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        Characters
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="drawer-link">
                                        Invite Friends
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="drawer-link">
                                        My account
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="drawer-link">
                                        Language
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="drawer-link">
                                        AGB
                                    </button>
                                </li>
                            </ul>

                            <div className="drawer-footer">
                                <button
                                    type="button"
                                    className="drawer-link"
                                    onClick={handleSignOut}
                                    aria-label="Logout"
                                >
                                    <FiLogOut style={{ marginRight: 8, verticalAlign: "-2px" }} />
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </aside>
                </dialog>
            )}
        </div>
    );
};

export default GameMenuPage;
