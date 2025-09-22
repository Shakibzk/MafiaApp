package org.example.backend.service;

import org.example.backend.model.Game;
import org.example.backend.repository.GameRepository;
import org.example.backend.BackendApplication;   // ✅ مسیر صحیح
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
class GameServiceTest {

    @Autowired private GameService gameService;
    @Autowired private GameRepository gameRepository;

    @Test
    void createAndRetrieveGame() {
        Game g = new Game();
        g.setPlayerCount(6);
        g.setNames(List.of("Alice", "Bob"));
        g.setRoles(List.of("Citizen", "Godfather"));
        g.setAssignments(Map.of("Alice","Citizen","Bob","Godfather"));

        Game saved = gameService.createGame(g);
        assertNotNull(saved.getId());

        Game fetched = gameRepository.findById(saved.getId()).orElseThrow();
        assertEquals(6, fetched.getPlayerCount());
        assertEquals(2, fetched.getNames().size());
        assertEquals("Citizen", fetched.getAssignments().get("Alice"));
    }
}
