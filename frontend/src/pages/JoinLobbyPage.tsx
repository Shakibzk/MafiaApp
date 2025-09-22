import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCopy, FaVolumeMute, FaMicrophone } from "react-icons/fa";

import sunIcon from "../assets/lobby/sun.png";


import { type LobbyMessage, useLobbySocket } from "../service/lobbySocket.ts";
import { characterInfo } from "../data/characterInfo";

type ApiPlayer = {
    username?: string;
    role?: string;
    inviteCode?: string;
    muted?: boolean;
    avatarKey?: string;
};

const JoinLobbyPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialUsername: string = location.state?.username ?? "Guest";
    const initialRole: string = location.state?.role ?? "—";
    const lobbyId: string = location.state?.lobbyId ?? "demo-lobby";
    const playerCode: string | undefined = location.state?.playerCode;

    const gameLink = useMemo(
        () => location.state?.inviteLink ?? "https://mafia.online/XWMK-6450-XWTD",
        [location.state?.inviteLink]
    );

    const [inviteOpen, setInviteOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    // ---- Character intro (from central characterInfo) ----
    const [showCharacterModal, setShowCharacterModal] = useState(true);
    const roleMeta = characterInfo[initialRole];
    const characterName: string = initialRole;
    const characterDesc: string =
        roleMeta?.description ?? "Your secret abilities will be revealed in game.";
    const characterImage: string = roleMeta?.image ?? "citizen.png";
    const characterSide: string = roleMeta?.side ?? "";

    // ---- Avatar picker ----
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string>("one");
    const avatarKeys = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
    ] as const;
    const avatarSrc = (key: string) =>
        new URL(`../assets/avatars/${key}.png`, import.meta.url).href;

    // ---- Players list (left column) ----
    const [players, setPlayers] = useState<ApiPlayer[]>([]);
    const [muted, setMuted] = useState(false);

    type _HasType = { type?: unknown };
    const { sendMessage } = useLobbySocket(lobbyId, (msg: LobbyMessage) => {
        const t = String((msg as _HasType).type);
        if (t === "ROLE_ASSIGNED") {
            setShowCharacterModal(true);
        }
    });

    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (inviteOpen) d.showModal();
        else d.close();
    }, [inviteOpen]);

    useEffect(() => {
        sendMessage(
            JSON.stringify({
                type: "JOIN",
                lobbyId,
                username: initialUsername,
                role: initialRole,
            })
        );
    }, [lobbyId, sendMessage, initialUsername, initialRole]);

    // Fetch current lobby to populate left column
    useEffect(() => {
        fetch(`/api/lobbies/${lobbyId}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to fetch lobby"))))
            .then((data: { players?: ApiPlayer[] }) => {
                const arr = (data.players ?? []).map((p) => ({
                    username: p.username ?? "",
                    role: p.role,
                    inviteCode: p.inviteCode,
                    muted: p.muted ?? false,
                    avatarKey: p.avatarKey ?? "one",
                }));
                setPlayers(arr);

                const me = arr.find((p) => p.username === initialUsername);
                if (me?.avatarKey) setSelectedAvatar(me.avatarKey);
                setMuted(Boolean(me?.muted));
            })
            .catch(() => setPlayers([]));
    }, [lobbyId, initialUsername]);

    const toggleMute = () => {
        const newVal = !muted;
        setMuted(newVal);
        sendMessage(
            JSON.stringify({
                type: "PLAYER_MUTED",
                lobbyId,
                username: initialUsername,
                muted: newVal,
            })
        );
        // reflect on my card
        setPlayers((prev) =>
            prev.map((p) =>
                p.username === initialUsername ? { ...p, muted: newVal } : p
            )
        );
    };

    const leaveLobby = () => {
        sendMessage(
            JSON.stringify({
                type: "LEAVE",
                lobbyId,
                username: initialUsername,
            })
        );
        navigate("/game");
    };

    // ✅ save avatar on server + immediately reflect in UI
    const saveAvatar = async () => {
        try {
            if (playerCode) {
                await fetch(`/api/lobbies/${lobbyId}/player/${playerCode}/avatar`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatarKey: selectedAvatar }),
                });
            }
        } catch (e) {
            console.error("Failed to set avatar", e);
        } finally {
            setPlayers((prev) => {
                const exists = prev.some((pl) => pl.username === initialUsername);
                if (exists) {
                    return prev.map((pl) =>
                        pl.username === initialUsername
                            ? { ...pl, avatarKey: selectedAvatar }
                            : pl
                    );
                }
                return [
                    {
                        username: initialUsername,
                        role: initialRole,
                        muted,
                        avatarKey: selectedAvatar,
                    },
                    ...prev,
                ];
            });
            setShowAvatarModal(false);
        }
    };

    const headerTimerText = "—";

    return (
        <div className="lobby-page">
            {/* ---- Character modal ---- */}
            {showCharacterModal && (
                <div className="character-intro-overlay">
                    <div className="character-intro-modal">
                        <h2>Your character</h2>
                        <p>
                            You have been given <b>{characterName}</b>, watch out for you!
                        </p>
                        <div className="character-card">
                            <img
                                src={
                                    new URL(
                                        `../assets/characters/${characterImage}`,
                                        import.meta.url
                                    ).href
                                }
                                alt={characterName}
                                className="character-img"
                            />
                            <div className="character-info">
                                <h3>{characterName}</h3>
                                <p>{characterDesc}</p>
                            </div>
                        </div>
                        <button
                            className="choose-btn"
                            onClick={() => {
                                setShowCharacterModal(false);
                                setShowAvatarModal(true);
                            }}
                        >
                            Choose my Icon
                        </button>
                    </div>
                </div>
            )}

            {/* ---- Avatar picker modal ---- */}
            {showAvatarModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            width: "min(640px, 92vw)",
                            background: "#121212",
                            color: "#fff",
                            borderRadius: 14,
                            padding: "24px 24px 20px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        }}
                        aria-modal="true"
                        aria-labelledby="avatarTitle"
                    >
                        <h2
                            id="avatarTitle"
                            style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}
                        >
                            Choose your profile picture
                        </h2>
                        <p style={{ margin: "0 0 18px", color: "#bdbdbd" }}>
                            Pick an image that fits you the best.
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                                gap: 16,
                                marginBottom: 18,
                            }}
                        >
                            {avatarKeys.map((key) => {
                                const selected = selectedAvatar === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedAvatar(key)}
                                        style={{
                                            display: "block",
                                            padding: 6,
                                            borderRadius: 12,
                                            background: selected ? "rgba(255,77,77,0.25)" : "#232323",
                                            border: selected ? "2px solid #ff4d4d" : "2px solid #2f2f2f",
                                            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)",
                                            cursor: "pointer",
                                        }}
                                        aria-pressed={selected}
                                        aria-label={`Choose avatar ${key}`}
                                    >
                                        <div
                                            style={{
                                                background: "#d6b170",
                                                borderRadius: 10,
                                                padding: 10,
                                                boxShadow: "0 3px 10px rgba(0,0,0,0.35)",
                                            }}
                                        >
                                            <img
                                                src={avatarSrc(key)}
                                                alt={key}
                                                style={{
                                                    width: "100%",
                                                    height: 92,
                                                    objectFit: "contain",
                                                    display: "block",
                                                    borderRadius: 8,
                                                }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <button
                                onClick={saveAvatar}
                                style={{
                                    background: "#6c43f3",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 32px",
                                    borderRadius: 24,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- Header with (non-running) Timer ---- */}
            <div className="lobby-header">
                <span className="lobby-phase" style={{ color: "#5c3b18" }}>
                    <img
                        src={sunIcon}
                        alt="phase-icon"
                        style={{
                            width: 60,
                            height: 60,
                            marginRight: 6,
                            verticalAlign: "middle",
                        }}
                    />{" "}
                    Phase: Day Discussion
                </span>

                <span className="lobby-timer" style={{ color: "#5c3b18", marginLeft: "-60px" }}>
                    Timer: {headerTimerText}
                </span>

                <button
                    className="lobby-exit"
                    style={{ color: "#5c3b18" }}
                    onClick={leaveLobby}
                >
                    <FaSignOutAlt style={{ marginRight: 6 }} /> Exit Game
                </button>
            </div>

            {/* ---- Main layout: Players LEFT (own container) / Abilities & Stats RIGHT (own container) ---- */}
            <div className="join-layout">
                {/* Left container: Players */}
                <div className="players-section">
                    <section className="join-left">
                        <h2 className="join-title">
                            Players ({players.length}/{players.length})
                        </h2>

                        <div className="join-players">
                            {players.map((p) => {
                                const key = p.avatarKey || "one";
                                const isMe = p.username === initialUsername;
                                const micMuted = isMe ? muted : !!p.muted;

                                return (
                                    <div className="join-player-card" key={`${p.username}-${p.inviteCode}`}>
                                        <div className="join-avatar-wrap">
                                            <img className="join-avatar" src={avatarSrc(key)} alt="avatar" />
                                        </div>
                                        <div className="join-player-meta">
                                            <div className="join-player-name">{p.username}</div>
                                            <div
                                                className="join-mic"
                                                {...(isMe
                                                    ? ({
                                                        onClick: toggleMute,
                                                        style: { cursor: "pointer" },
                                                        title: "Toggle my mic",
                                                    } as React.HTMLAttributes<HTMLDivElement>)
                                                    : {})}
                                            >
                                                {micMuted ? (
                                                    <>
                                                        <FaVolumeMute aria-hidden style={{ marginRight: 6 }} />
                                                        <span>Muted</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaMicrophone aria-hidden style={{ marginRight: 6 }} />
                                                        <span>Mic</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right container: Abilities & Stats */}
                <div className="right-section">
                    <section className="join-right">
                        <h2 className="join-panel-title">Character Abilities</h2>
                        <div className="join-panel join-panel--narrow">
                            <div className="join-ability">
                                <img
                                    src={
                                        new URL(`../assets/characters/${characterImage}`, import.meta.url).href
                                    }
                                    alt={characterName}
                                    className="join-poster"
                                />
                                <div className="join-ability-info">
                                    <div className="join-ability-head">
                                        <h3>{characterName}</h3>
                                        {characterSide && <span className="join-badge">{characterSide}</span>}
                                    </div>
                                    <p className="join-ability-desc">{characterDesc}</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="join-panel-title">Character Stats</h2>
                        <div className="join-panel join-panel--narrow">
                            <div className="join-stats-box">
                                <ul>
                                    <li>Shots fired: 0 times</li>
                                    <li>Shot: 0 times</li>
                                    <li>Healed: 0 times</li>
                                    <li>Used Vest: 0 times</li>
                                    <li>Used Six Sense: 0 times</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* ---- Invite dialog ---- */}
            <dialog
                ref={dialogRef}
                className="invite-modal"
                aria-labelledby="inviteTitle"
                aria-describedby="inviteDesc"
                onCancel={() => setInviteOpen(false)}
            >
                <button
                    className="invite-close"
                    onClick={() => setInviteOpen(false)}
                    aria-label="Close invite dialog"
                >
                    ✕
                </button>
                <h2 id="inviteTitle">Invite Players</h2>
                <p id="inviteDesc">Share the game link so other players can join your game.</p>
                <label className="invite-label" htmlFor="gameLink">
                    Game Link
                </label>
                <div className="invite-link-row">
                    <input id="gameLink" type="text" readOnly value={gameLink} />
                    <button
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(gameLink)}
                    >
                        <FaCopy style={{ marginRight: 6 }} /> Copy
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default JoinLobbyPage;
