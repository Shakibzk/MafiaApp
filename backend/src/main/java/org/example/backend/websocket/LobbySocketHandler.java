package org.example.backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.websocket.dto.LobbyMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class LobbySocketHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Set<WebSocketSession>> lobbySessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("✅ WS Connected: {}", session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        lobbySessions.values().forEach(set -> set.remove(session));
        log.info("❌ WS Closed: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        LobbyMessage msg = mapper.readValue(message.getPayload(), LobbyMessage.class);
        if (msg.getLobbyId() == null || msg.getType() == null) return;

        lobbySessions.computeIfAbsent(msg.getLobbyId(), k -> ConcurrentHashMap.newKeySet()).add(session);

        switch (msg.getType()) {
            case JOIN -> {
                broadcast(msg.getLobbyId(),
                        new LobbyMessage(LobbyMessage.MessageType.JOIN, msg.getLobbyId(), msg.getUsername(), "joined"));
                LobbyMessage roleMsg = new LobbyMessage(
                        LobbyMessage.MessageType.ROLE_ASSIGNED,
                        msg.getLobbyId(),
                        msg.getUsername(),
                        "godfather"
                );
                session.sendMessage(new TextMessage(mapper.writeValueAsString(roleMsg)));
            }
            case LEAVE -> broadcast(msg.getLobbyId(),
                    new LobbyMessage(LobbyMessage.MessageType.LEAVE, msg.getLobbyId(), msg.getUsername(), "left"));
            case START_NIGHT -> broadcast(msg.getLobbyId(),
                    new LobbyMessage(LobbyMessage.MessageType.START_NIGHT, msg.getLobbyId(), null, "night"));
            case START_DAY -> broadcast(msg.getLobbyId(),
                    new LobbyMessage(LobbyMessage.MessageType.START_DAY, msg.getLobbyId(), null, "day"));
            case TIMER -> broadcast(msg.getLobbyId(), msg);
            case CHAT -> broadcast(msg.getLobbyId(), msg);
            default -> session.sendMessage(new TextMessage("{\"error\":\"Unknown type\"}"));
        }
    }

    private void broadcast(String lobbyId, LobbyMessage msg) throws IOException {
        String json = mapper.writeValueAsString(msg);
        for (WebSocketSession s : lobbySessions.getOrDefault(lobbyId, Set.of())) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(json));
            }
        }
    }
}
