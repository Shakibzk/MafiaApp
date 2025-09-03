import React from "react";
import githubLogo from "./assets/github.png";

const HomePage: React.FC = () => {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundImage: "url('/welcome.png')", //  در public
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* دکمه‌ها: پایینِ صفحه و وسط */}
            <div
                style={{
                    position: "absolute",
                    bottom: "8%",            // پایین‌تر
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "min(90vw, 600px)",
                }}
            >
                {/* دکمه مشترک */}
                {[
                    {
                        key: "google",
                        onClick: () => (window.location.href = "/oauth2/authorization/google"),
                        label: "Sign in with Google",
                        icon: (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                width="20"
                                height="20"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                />
                            </svg>
                        ),
                        aria: "Sign in with Google",
                    },
                    {
                        key: "github",
                        onClick: () => (window.location.href = "/oauth2/authorization/github"),
                        label: "Sign in with GitHub",
                        icon: (
                            <img
                                src={githubLogo}    //  از src/assets
                                alt=""
                                width={20}
                                height={20}
                                style={{ display: "block" }}
                                aria-hidden="true"
                            />
                        ),
                        aria: "Sign in with GitHub",
                    },
                ].map((b) => (
                    <button
                        key={b.key}
                        onClick={b.onClick}
                        aria-label={b.aria}
                        style={{
                            // استایل مستطیلی و مینیمال
                            display: "inline-flex",
                            alignItems: "center",   //  آیکون کنار متن هم‌تراز
                            gap: "10px",
                            padding: "12px 18px",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.35)",
                            background: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(4px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#111",
                            cursor: "pointer",
                            outline: "none",
                            transition: "transform 120ms ease, box-shadow 120ms ease",
                        }}
                        onMouseDown={(e) =>
                            ((e.currentTarget.style.transform = "translateY(1px)"),
                                (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2)"))
                        }
                        onMouseUp={(e) =>
                            ((e.currentTarget.style.transform = "translateY(0)"),
                                (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)"))
                        }
                    >
                        {b.icon}
                        <span>{b.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomePage;

