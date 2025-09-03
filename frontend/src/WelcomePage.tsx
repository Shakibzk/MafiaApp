import React from "react";

const WelcomePage: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#f0f0f0",
                color: "#333",
            }}
        >
            <h1>🎉 Welcome to Mafia Game!</h1>
            <p>You have successfully logged in with GitHub/Google.</p>
        </div>
    );
};

export default WelcomePage;
