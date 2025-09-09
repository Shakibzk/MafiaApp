package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload, Authentication authentication) {
        String username = payload.get("username");
        String gender = payload.get("gender");

        if (username == null || !username.matches("^[A-Za-z0-9]+$")) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Der Nutzername darf keine Leerzeichen oder Sonderzeichen enthalten.")
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
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("error", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Serverfehler. Bitte versuchen Sie es erneut.")
            );
        }
    }

    @PostMapping("/accept-agb")
    public ResponseEntity<?> acceptAgb(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized"));
        }

        try {
            String userId = authentication.getName();
            User updated = userService.acceptAgb(userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Fehler beim Speichern der AGB-Zustimmung.")
            );
        }
    }

    @PostMapping("/set-username")
    public ResponseEntity<?> setUsername(Authentication authentication, @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String gender = payload.get("gender");

        if (username == null || !username.matches("^[A-Za-z0-9]+$")) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Der Nutzername darf keine Leerzeichen oder Sonderzeichen enthalten.")
            );
        }

        try {
            if (authentication != null && authentication.isAuthenticated()) {
                String userId = authentication.getName();
                User updated = userService.updateUsername(userId, username, gender);
                return ResponseEntity.ok(updated);
            }

            // fallback → ثبت نام کاربر جدید
            User saved = userService.registerUser(username, gender);
            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("error", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Serverfehler. Bitte versuchen Sie es erneut.")
            );
        }
    }
}
