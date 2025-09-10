package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MeController {

    private final UserService userService;

    @GetMapping("/api/user")
    public ResponseEntity<Object> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        String userId = authentication.getName();

        return userService.findById(userId)
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(Map.of(
                        "authenticated", true,
                        "user", user
                )))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
