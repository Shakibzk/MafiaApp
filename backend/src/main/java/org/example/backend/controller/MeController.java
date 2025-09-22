package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MeController {

    private final UserService userService;

    @GetMapping("/api/user")
    public ResponseEntity<Map<String, Object>> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            Map<String, Object> body = new HashMap<>();
            body.put("authenticated", false);
            return ResponseEntity.ok(body);
        }

        String userId = authentication.getName();

        return userService.findById(userId)
                .map(user -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("authenticated", true);
                    body.put("user", user);
                    return ResponseEntity.ok(body);
                })
                .orElseGet(() -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("error", "User not found");
                    return ResponseEntity.status(404).body(body);
                });
    }
}
