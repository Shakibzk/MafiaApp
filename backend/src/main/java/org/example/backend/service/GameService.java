package org.example.backend.service;

import org.example.backend.model.Game;
import org.example.backend.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameService {

    private final GameRepository repo;

    public GameService(GameRepository repo) {
        this.repo = repo;
    }

    public Game createGame(Game game) {
        return repo.save(game);
    }

    public Optional<Game> getGame(String id) {
        return repo.findById(id);
    }
}
