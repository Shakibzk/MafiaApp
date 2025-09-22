package org.example.backend.controller;

import org.example.backend.dto.GameDto;
import org.example.backend.model.Game;
import org.example.backend.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @PostMapping
    public GameDto createGame(@RequestBody GameDto dto) {
        Game game = new Game();
        game.setPlayerCount(dto.getPlayerCount());
        game.setNames(dto.getNames());
        game.setRoles(dto.getRoles());
        game.setAssignments(dto.getAssignments());

        Game saved = service.createGame(game);

        GameDto out = new GameDto();
        out.setId(saved.getId());
        out.setPlayerCount(saved.getPlayerCount());
        out.setNames(saved.getNames());
        out.setRoles(saved.getRoles());
        out.setAssignments(saved.getAssignments());
        return out;
    }

    @GetMapping("/{id}")
    public GameDto getGame(@PathVariable String id) {
        Game saved = service.getGame(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        GameDto out = new GameDto();
        out.setId(saved.getId());
        out.setPlayerCount(saved.getPlayerCount());
        out.setNames(saved.getNames());
        out.setRoles(saved.getRoles());
        out.setAssignments(saved.getAssignments());
        return out;
    }
}
