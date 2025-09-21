package org.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Document(collection = "lobbies")
public class Lobby {

    @Id
    private String id;

    private String gameId;

    private List<PlayerState> players = new ArrayList<>();

    private Phase phase = Phase.DAY;

    private int timerSeconds = 0;

    private String createdBy;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public List<PlayerState> getPlayers() { return players; }
    public void setPlayers(List<PlayerState> players) { this.players = players; }

    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }

    public int getTimerSeconds() { return timerSeconds; }
    public void setTimerSeconds(int timerSeconds) { this.timerSeconds = timerSeconds; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    /** Game Phase */
    public enum Phase { DAY, NIGHT }
}
