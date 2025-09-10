package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.example.backend.util.ValidationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final String ERROR_KEY = "error";

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody Map<String, String> payload, Authentication authentication) {
        String username = payload.get("username");
        String gender = payload.get("gender");

        if (!ValidationUtil.isValidUsername(username)) {
            return ResponseEntity.badRequest().body(
                    Map.of(ERROR_KEY, "Der Nutzername darf keine Leerzeichen oder Sonderzeichen enthalten.")
            );
        }

        try {
            if (authentication != null && authentication.isAuthenticated()) {
                String userId = authentication.getName();
                User updated = userService.updateUsername(userId, username, gender);
                return ResponseEntity.ok(updated);
            }

            User saved = userService.registerUser(username, gender);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(ERROR_KEY, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(ERROR_KEY, "Serverfehler. Bitte versuchen Sie es erneut."));
        }
    }

    @PostMapping("/accept-agb")
    public ResponseEntity<Object> acceptAgb(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(ERROR_KEY, "Unauthorized"));
        }

        try {
            String userId = authentication.getName();
            User updated = userService.acceptAgb(userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(ERROR_KEY, "Fehler beim Speichern der AGB-Zustimmung."));
        }
    }

    @PostMapping("/set-username")
    public ResponseEntity<Object> setUsername(Authentication authentication, @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String gender = payload.get("gender");

        if (!ValidationUtil.isValidUsername(username)) {
            return ResponseEntity.badRequest().body(
                    Map.of(ERROR_KEY, "Der Nutzername darf keine Leerzeichen oder Sonderzeichen enthalten.")
            );
        }

        try {
            if (authentication != null && authentication.isAuthenticated()) {
                String userId = authentication.getName();
                User updated = userService.updateUsername(userId, username, gender);
                return ResponseEntity.ok(updated);
            }

            User saved = userService.registerUser(username, gender);
            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(ERROR_KEY, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(ERROR_KEY, "Serverfehler. Bitte versuchen Sie es erneut."));
        }
    }
}
