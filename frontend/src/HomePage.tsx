import React from "react";
import githubLogo from "./assets/github.png";
import googleLogo from "./assets/google.png";
import appLogo from "./assets/app-logo.png"; // لوگوی Mafia

const HomePage: React.FC = () => {
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
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* لوگوی Mafia */}
            <div style={{ marginBottom: "20px" }}>
                <img
                    src={appLogo}
                    alt="Mafia Logo"
                    style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* عنوان اصلی */}
            <h1
                style={{
                    fontSize: "clamp(24px, 6vw, 42px)",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                    marginBottom: "12px",
                }}
            >
                Welcome to Mafia Online
            </h1>

            {/* متن زیرعنوان */}
            <p
                style={{
                    fontSize: "clamp(14px, 4vw, 16px)",
                    marginBottom: "40px",
                    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                    maxWidth: "500px",
                }}
            >
                Trust no one. Work with your allies, deceive your enemies, and survive the night.
            </p>

            {/* دکمه‌ها */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {/* Google */}
                <button
                    onClick={() =>
                        (window.location.href = "/oauth2/authorization/google")
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        border: "1px solid #dadce0",
                        background: "#fff",
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#3c4043",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        minWidth: "220px",
                        width: "100%",
                        maxWidth: "280px",
                    }}
                >
                    <img
                        src={googleLogo}
                        alt="Google"
                        width={18}
                        height={18}
                        style={{ display: "block" }}
                    />
                    <span>Sign in with Google</span>
                </button>

                {/* GitHub */}
                <button
                    onClick={() =>
                        (window.location.href = "/oauth2/authorization/github")
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        border: "1px solid #000",
                        background: "#000",
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: "14px",
                        cursor: "pointer",
                        minWidth: "220px",
                        width: "100%",
                        maxWidth: "280px",
                    }}
                >
                    <img
                        src={githubLogo}
                        alt="GitHub"
                        width={18}
                        height={18}
                        style={{ display: "block", filter: "invert(1)" }}
                    />
                    <span>Sign in with GitHub</span>
                </button>
            </div>
        </div>
    );
};

export default HomePage;


