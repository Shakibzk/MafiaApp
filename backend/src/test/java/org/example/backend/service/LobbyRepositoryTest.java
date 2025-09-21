package org.example.backend.service;

import org.example.backend.BackendApplication;
import org.example.backend.model.Lobby;
import org.example.backend.model.PlayerState;
import org.example.backend.repository.LobbyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
class LobbyRepositoryTest {

    @Autowired
    private LobbyRepository lobbyRepository;

    @Test
    void saveAndFindLobby() {
        Lobby lobby = new Lobby();
        lobby.setGameId("game123");
        lobby.setCreatedBy("user1");

        PlayerState p = new PlayerState();
        p.setUsername("Alice");
        p.setRole("Citizen");
        lobby.setPlayers(List.of(p));

        Lobby saved = lobbyRepository.save(lobby);
        assertNotNull(saved.getId());

        Lobby found = lobbyRepository.findById(saved.getId()).orElseThrow();
        assertEquals("game123", found.getGameId());
        assertEquals(1, found.getPlayers().size());
        assertEquals("Alice", found.getPlayers().get(0).getUsername());
    }
}
