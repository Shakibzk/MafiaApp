import useWebSocket from "react-use-websocket";

export interface LobbyMessage {
    type: "JOIN" | "LEAVE" | "START_NIGHT" | "START_DAY" | "CHAT" | "TIMER";
    lobbyId: string;
    username?: string;
    content?: string;
    seconds?: number;
}

export function useLobbySocket(
    lobbyId: string,
    onMessage: (msg: LobbyMessage) => void
) {
    return useWebSocket(`ws://localhost:8080/api/ws/lobby`, {
        queryParams: { lobbyId },
        onOpen: () => console.log("✅ WS connected"),
        onClose: () => console.log("❌ WS closed"),
        onMessage: (e) => {
            const data: LobbyMessage = JSON.parse(e.data);
            onMessage(data);
        },
    });
}
