import React, { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {
    FaMoon,
    FaClock,
    FaMicrophoneSlash,
    FaVoteYea,
    FaUserPlus,
    FaSignOutAlt,
    FaSun,
    FaVolumeMute,
    FaRegComments,
    FaChevronDown
} from "react-icons/fa";
import sunIcon from "../assets/lobby/sun.png";
import moonIcon from "../assets/lobby/moon.png";
import backImg from "../assets/lobby/back.png";
import nightImg from "../assets/lobby/night.png";
import buildingsImg from "../assets/lobby/buildings.png";
import { type LobbyMessage, useLobbySocket } from "../service/lobbySocket.ts";

const ControlButton: React.FC<{
    onClick?: () => void;
    icon: ReactNode;
    label: string;
    wide?: boolean;
}> = ({ onClick, icon, label, wide }) => (
    <button className={`ctrl-btn ${wide ? "wide" : ""}`} onClick={onClick}>
        {icon} {label}
    </button>
);

type Player = { name: string; role: string; inviteCode?: string; username?: string };

const LobbyPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const playersInit: Player[] = location.state?.players || [];
    const playerCount = playersInit.length;

    const [players, setPlayers] = useState<Player[]>(playersInit);
    const [inviteOpen, setInviteOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [isNightPhase, setIsNightPhase] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.name ?? "");
    const [openStat, setOpenStat] = useState<string | null>(null);

    const [timerRunning, setTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const lobbyId = location.state?.lobbyId || "demo-lobby";

    useWebSocket("ws://localhost:8080/api/ws/lobby", {
        onOpen: () => console.log("✅ WS connected"),
        onMessage: (event: MessageEvent) => {
            try {
                const data: {
                    players?: Array<{ username?: string; role: string; inviteCode?: string }>;
                    timerSeconds?: number;
                    phase?: string;
                } = JSON.parse(event.data);

                if (data.players) {
                    setPlayers(
                        data.players.map((p) => ({
                            name: p.username ?? "",
                            role: p.role,
                            inviteCode: p.inviteCode
                        }))
                    );
                }
                if (typeof data.timerSeconds === "number") setSeconds(data.timerSeconds);
                if (data.phase) setIsNightPhase(data.phase === "NIGHT");
            } catch (e) {
                console.error("WS parse error", e);
            }
        },
        onClose: () => console.log("❌ WS closed")
    });

    useEffect(() => {
        if (!timerRunning) return;
        const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(interval);
    }, [timerRunning]);

    const formatTime = (t: number) =>
        `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

    useEffect(() => {
        if (inviteOpen) dialogRef.current?.showModal();
        else dialogRef.current?.close();
    }, [inviteOpen]);

    useLobbySocket(lobbyId, (msg: LobbyMessage) => {
        if (msg.type === "START_NIGHT") {
            setIsNightPhase(true);
        }
    });

    useEffect(() => {
        fetch(`/api/lobbies/${lobbyId}`)
            .then((res) => res.json())
            .then((data: { players?: Array<{ username?: string; role: string; inviteCode?: string }> }) => {
                if (data.players) {
                    setPlayers(
                        data.players.map((p) => ({
                            name: p.username ?? "",
                            role: p.role,
                            inviteCode: p.inviteCode
                        }))
                    );
                }
            })
            .catch((err) => console.error("Failed to fetch lobby", err));
    }, [lobbyId]);

    return (
        <div
            className="lobby-page"
            style={{
                backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) 10%,
            rgba(0,0,0,0.01) 10%,
            rgba(0,0,0,0.01) 100%
          ),
          url(${buildingsImg}),
          url(${isNightPhase ? nightImg : backImg})
        `,
                backgroundSize: "100% 100%, 100% 90%, 100% 10%",
                backgroundPosition: "top, bottom, top",
                backgroundRepeat: "no-repeat, no-repeat, no-repeat",
                backgroundAttachment: "fixed"
            }}
        >
            <div className="lobby-header">
                <span
                    className="lobby-phase"
                    style={{ color: isNightPhase ? "#ffffff" : "#5c3b18" }}
                >
                    <img
                        src={isNightPhase ? moonIcon : sunIcon}
                        alt={isNightPhase ? "Moon icon" : "Sun icon"}
                        style={{
                            width: "60px",
                            height: "60px",
                            marginRight: "6px",
                            verticalAlign: "middle"
                        }}
                    />
                    Phase: {isNightPhase ? "Night" : "Day"} Discussion
                </span>

                <span
                    className="lobby-timer"
                    style={{
                        color: isNightPhase ? "#ffffff" : "#5c3b18",
                        marginLeft: "-60px"
                    }}
                >
                    Timer: {timerRunning ? formatTime(seconds) : "-"}
                </span>

                <button
                    className="lobby-exit"
                    style={{ color: isNightPhase ? "#ffffff" : "#5c3b18" }}
                    onClick={() => navigate("/game")}
                >
                    <FaSignOutAlt style={{ marginRight: "6px" }} /> Exit Game
                </button>
            </div>

            <div className="lobby-content">
                <div className="lobby-section players-list">
                    <h2>Players ({players.length}/{playerCount})</h2>
                    <div className="players-grid">
                        {players.map((p) => (
                            <div key={p.name} className="player-card">
                                <div className="player-header">
                                    <span className="player-name">{p.name}</span>
                                    <span className="player-role">{p.role}</span>
                                </div>
                                <div className="player-status">
                                    <span className="status-dot" aria-hidden="true"></span>
                                    <span className="status-text">Alive</span>
                                </div>
                                <div className="player-actions">
                                    <button className="player-btn">
                                        <FaVolumeMute /> Mute
                                    </button>
                                    <button className="player-btn">
                                        <FaRegComments /> Whisper
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lobby-section control-room">
                    <h2>Control Room</h2>
                    <div className="control-buttons">
                        <ControlButton
                            onClick={() => setIsNightPhase(!isNightPhase)}
                            icon={
                                isNightPhase ? (
                                    <FaSun style={{ marginRight: "6px" }} />
                                ) : (
                                    <FaMoon style={{ marginRight: "6px" }} />
                                )
                            }
                            label={isNightPhase ? "Start Day Phase" : "Start Night Phase"}
                        />
                        <ControlButton
                            onClick={() => {
                                if (timerRunning) {
                                    setTimerRunning(false);
                                    setSeconds(0);
                                } else {
                                    setTimerRunning(true);
                                }
                            }}
                            icon={<FaClock style={{ marginRight: "6px" }} />}
                            label={timerRunning ? "Reset Timer" : "Start Timer"}
                        />
                        <ControlButton icon={<FaMicrophoneSlash style={{ marginRight: "6px" }} />} label="Mute All" />
                        <ControlButton icon={<FaVoteYea style={{ marginRight: "6px" }} />} label="Select for vote" />
                        <ControlButton
                            wide
                            onClick={() => setInviteOpen(true)}
                            icon={<FaUserPlus style={{ marginRight: "6px" }} />}
                            label="Invite Players"
                        />
                    </div>

                    <h2 className="players-stats-title">Players Stats</h2>
                    <div className="players-stats">
                        {players.map((p) => {
                            const open = openStat === p.name;
                            return (
                                <div className={`stat-item ${open ? "open" : ""}`} key={p.name}>
                                    <button
                                        className="stat-header"
                                        onClick={() => setOpenStat(open ? null : p.name)}
                                    >
                                        <span className="stat-name">{p.name}</span>
                                        <span className="stat-role">{p.role}</span>
                                        <FaChevronDown className="chev" />
                                    </button>
                                    <div className="stat-body" hidden={!open}>
                                        <ul>
                                            <li>Votes: 0</li>
                                            <li>Muted: No</li>
                                            <li>Notes: —</li>
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

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
                <p id="inviteDesc">
                    Share the Player Code so each player can join with their unique code.
                </p>

                <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                >
                    {players.map((p) => (
                        <option key={p.name}>{p.name}</option>
                    ))}
                </select>

                <label className="invite-label" htmlFor="gameCode">
                    Player Code
                </label>
                <div className="invite-link-row">
                    <input
                        id="gameCode"
                        type="text"
                        readOnly
                        value={players.find(pl => pl.name === selectedPlayer)?.inviteCode || ""}
                    />
                    <button
                        className="copy-btn"
                        onClick={() =>
                            navigator.clipboard.writeText(
                                players.find(pl => pl.name === selectedPlayer)?.inviteCode || ""
                            )
                        }
                    >
                        Copy
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default LobbyPage;
