package org.example.backend.websocket.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LobbyMessage {

    public enum MessageType {
        JOIN,
        LEAVE,
        START_NIGHT,
        START_DAY,
        CHAT,
        ROLE_ASSIGNED,
        TIMER
    }

    private MessageType type;
    private String lobbyId;
    private String username;
    private String content;

    private Integer seconds;


    public LobbyMessage(MessageType type, String lobbyId, String username, String content) {
        this.type = type;
        this.lobbyId = lobbyId;
        this.username = username;
        this.content = content;
    }


    public LobbyMessage(MessageType type, String lobbyId, Integer seconds) {
        this.type = type;
        this.lobbyId = lobbyId;
        this.seconds = seconds;
    }
}
