import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";
import appLogo from "./assets/app-logo.png";

const GameMenuPage: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

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

    // 🆕 function for Home button
    const handleGoHome = () => {
        navigate("/game"); // مسیر GameMenuPage در main.tsx تعریف شده
        setDrawerOpen(false); // بعد از کلیک، منو بسته بشه
    };

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
            {/* Top right - Settings button */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <img
                    src={appLogo}
                    alt="Mafia Logo"
                    style={{ width: "50px", height: "50px" }}
                />
                <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <FiSettings size={20} /> Settings
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
                    gap: "24px",
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
                    style={{
                        display: "flex",
                        gap: "16px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <button className="btn btn-primary">Start Game</button>
                    <button className="btn btn-outline">Rules</button>
                    <button className="btn btn-outline">Roles</button>
                </div>
            </div>

            {/* Drawer menu */}
            {drawerOpen && (
                <div className="drawer">
                    <div className="drawer-content">
                        <button
                            className="drawer-close"
                            onClick={() => setDrawerOpen(false)}
                        >
                            ×
                        </button>
                        <ul>
                            {/* 🆕 Home button navigates to GameMenuPage */}
                            <li onClick={handleGoHome}>Home</li>
                            <li>How to play</li>
                            <li>Characters</li>
                            <li>Invite Friends</li>
                            <li>My account</li>
                            <li>Language</li>
                            <li>Terms & Conditions</li>
                            <li onClick={handleSignOut}>
                                <FiLogOut style={{ marginRight: "8px" }} /> Logout
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameMenuPage;
