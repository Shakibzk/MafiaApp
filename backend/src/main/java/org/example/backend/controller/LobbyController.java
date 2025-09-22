package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Lobby;
import org.example.backend.model.PlayerState;
import org.example.backend.service.LobbyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lobbies")
@RequiredArgsConstructor
public class LobbyController {

    private final LobbyService lobbyService;

    @PostMapping
    public ResponseEntity<Lobby> createLobby(@RequestBody Map<String,String> payload,
                                             Authentication auth) {
        String gameId   = payload.get("gameId");
        String createdBy = (auth != null && auth.isAuthenticated())
                ? auth.getName() : "anonymous";
        Lobby lobby = lobbyService.createLobby(gameId, createdBy);
        return ResponseEntity.ok(lobby);
    }

    @PostMapping("/{lobbyId}/join")
    public ResponseEntity<Lobby> joinLobby(@PathVariable String lobbyId,
                                           @RequestBody PlayerState player) {
        Lobby lobby = lobbyService.addPlayer(lobbyId, player);
        return ResponseEntity.ok(lobby);
    }

    @PatchMapping("/{lobbyId}/phase")
    public ResponseEntity<Lobby> updatePhase(@PathVariable String lobbyId,
                                             @RequestBody Map<String,String> payload) {
        Lobby.Phase phase = Lobby.Phase.valueOf(payload.get("phase"));
        Lobby lobby = lobbyService.updatePhase(lobbyId, phase);
        return ResponseEntity.ok(lobby);
    }

    @PatchMapping("/{lobbyId}/timer")
    public ResponseEntity<Lobby> updateTimer(@PathVariable String lobbyId,
                                             @RequestBody Map<String,Integer> payload) {
        int seconds = payload.getOrDefault("seconds", 0);
        Lobby lobby = lobbyService.updateTimer(lobbyId, seconds);
        return ResponseEntity.ok(lobby);
    }

    @GetMapping("/{lobbyId}")
    public ResponseEntity<Lobby> getLobby(@PathVariable String lobbyId) {
        return lobbyService.getLobby(lobbyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 🔹 دریافت اطلاعات یک بازیکن با استفاده از inviteCode و شناسه لابی (قدیمی) */
    @GetMapping("/{lobbyId}/playerByCode/{code}")
    public ResponseEntity<PlayerState> getPlayerByCodeInLobby(@PathVariable String lobbyId,
                                                              @PathVariable String code) {
        return lobbyService.getPlayerByCode(lobbyId, code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 🔹 دریافت اطلاعات یک بازیکن فقط با inviteCode (برای StartGamePage) */
    @GetMapping("/playerByCode/{code}")
    public ResponseEntity<PlayerState> getPlayerByCode(@PathVariable String code) {
        return lobbyService.getPlayerByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{lobbyId}/player/{code}/avatar")
    public ResponseEntity<Lobby> setAvatar(@PathVariable String lobbyId,
                                           @PathVariable("code") String inviteCode,
                                           @RequestBody Map<String,String> body) {
        String key = body.get("avatarKey");
        Lobby lobby = lobbyService.updatePlayerAvatar(lobbyId, inviteCode, key);
        return ResponseEntity.ok(lobby);
    }

}
