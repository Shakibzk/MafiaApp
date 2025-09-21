package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Lobby;
import org.example.backend.model.PlayerState;
import org.example.backend.repository.LobbyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LobbyService {

    private static final String ERR_NOT_FOUND = "Lobby not found";

    private final LobbyRepository lobbyRepository;

    public Lobby createLobby(String gameId, String createdBy) {
        Lobby lobby = new Lobby();
        lobby.setGameId(gameId);
        lobby.setCreatedBy(createdBy);
        return lobbyRepository.save(lobby);
    }

    public synchronized Lobby addPlayer(String lobbyId, PlayerState player) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException(ERR_NOT_FOUND));

        if (player.getInviteCode() == null || player.getInviteCode().isEmpty()) {
            player.setInviteCode(UUID.randomUUID().toString());
        }

        boolean exists = lobby.getPlayers().stream()
                .anyMatch(p -> p.getUsername() != null &&
                        p.getUsername().equals(player.getUsername()));
        if (!exists) {
            lobby.getPlayers().add(player);
            lobby = lobbyRepository.save(lobby);
        }

        return lobby;
    }

    public Lobby updatePhase(String lobbyId, Lobby.Phase phase) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException(ERR_NOT_FOUND));
        lobby.setPhase(phase);
        return lobbyRepository.save(lobby);
    }

    public Lobby updateTimer(String lobbyId, int seconds) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException(ERR_NOT_FOUND));
        lobby.setTimerSeconds(seconds);
        return lobbyRepository.save(lobby);
    }

    public Optional<Lobby> getLobby(String lobbyId) {
        return lobbyRepository.findById(lobbyId);
    }

    public List<Lobby> getAll() {
        return lobbyRepository.findAll();
    }

    public Optional<PlayerState> getPlayerByCode(String code) {
        return lobbyRepository.findAll().stream()
                .flatMap(l -> l.getPlayers().stream())
                .filter(p -> code.equals(p.getInviteCode()))
                .findFirst();
    }

    public Optional<PlayerState> getPlayerByCode(String lobbyId, String code) {
        return lobbyRepository.findById(lobbyId)
                .flatMap(lobby ->
                        lobby.getPlayers().stream()
                                .filter(p -> code.equals(p.getInviteCode()))
                                .findFirst()
                );
    }

    public synchronized Lobby updatePlayerAvatar(String lobbyId, String inviteCode, String avatarKey) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException(ERR_NOT_FOUND));

        boolean changed = false;
        for (PlayerState p : lobby.getPlayers()) {
            if (inviteCode != null && inviteCode.equals(p.getInviteCode())) {
                String key = (avatarKey == null || avatarKey.isBlank()) ? "one" : avatarKey;
                p.setAvatarKey(key);
                changed = true;
                break;
            }
        }
        if (!changed) {
            throw new IllegalArgumentException("Player not found for given code");
        }
        return lobbyRepository.save(lobby);
    }
}
