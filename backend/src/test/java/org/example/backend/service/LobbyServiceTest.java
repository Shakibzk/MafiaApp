package org.example.backend.service;

import org.example.backend.BackendApplication;
import org.example.backend.model.Lobby;
import org.example.backend.model.PlayerState;
import org.example.backend.repository.LobbyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
class LobbyServiceTest {

    @Autowired private LobbyService lobbyService;
    @Autowired private LobbyRepository lobbyRepository;

    @Test
    void createAddPlayerAndUpdatePhaseTimer() {
        // ایجاد لابی
        Lobby created = lobbyService.createLobby("game123", "user1");
        assertNotNull(created.getId());
        assertEquals("game123", created.getGameId());
        assertEquals("user1", created.getCreatedBy());

        // افزودن بازیکن
        PlayerState p = new PlayerState();
        p.setUsername("Alice");
        p.setRole("Citizen");
        Lobby withPlayer = lobbyService.addPlayer(created.getId(), p);
        assertEquals(1, withPlayer.getPlayers().size());
        assertEquals("Alice", withPlayer.getPlayers().get(0).getUsername());

        // تغییر فاز
        Lobby updatedPhase = lobbyService.updatePhase(created.getId(), Lobby.Phase.NIGHT);
        assertEquals(Lobby.Phase.NIGHT, updatedPhase.getPhase());

        // به‌روزرسانی تایمر
        Lobby updatedTimer = lobbyService.updateTimer(created.getId(), 45);
        assertEquals(45, updatedTimer.getTimerSeconds());

        // بررسی ذخیره در DB
        Lobby found = lobbyRepository.findById(created.getId()).orElseThrow();
        assertEquals(1, found.getPlayers().size());
        assertEquals(45, found.getTimerSeconds());
    }
}
