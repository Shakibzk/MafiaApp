package org.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "games")
public class Game {

    @Id
    private String id;

    private int playerCount;
    private List<String> names;
    private List<String> roles;
    private Map<String,String> assignments;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public int getPlayerCount() { return playerCount; }
    public void setPlayerCount(int playerCount) { this.playerCount = playerCount; }

    public List<String> getNames() { return names; }
    public void setNames(List<String> names) { this.names = names; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public Map<String, String> getAssignments() { return assignments; }
    public void setAssignments(Map<String, String> assignments) { this.assignments = assignments; }
}
