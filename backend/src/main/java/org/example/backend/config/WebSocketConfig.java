package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.websocket.LobbySocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final LobbySocketHandler lobbySocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // ws://localhost:8080/api/ws/lobby
        registry.addHandler(lobbySocketHandler, "/api/ws/lobby")
                .setAllowedOrigins("*");
    }
}
