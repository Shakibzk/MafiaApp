package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(String username, String gender) {
        userRepository.findByUsername(username).ifPresent(u -> {
            throw new IllegalArgumentException("Dieser Benutzername ist bereits vergeben.");
        });

        User newUser = new User(null, username, gender, false);
        return userRepository.save(newUser);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User saveOAuthUserIfNotExists(String userId) {
        return userRepository.findById(userId).orElseGet(() -> {
            return userRepository.save(new User(userId, null, null, false));
        });
    }

    public User acceptAgb(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setAcceptedAgb(true);
        return userRepository.save(user);
    }

    public User updateUsername(String userId, String username, String gender) {
        userRepository.findByUsername(username).ifPresent(u -> {
            if (!u.getId().equals(userId)) {
                throw new IllegalArgumentException("Dieser Benutzername ist bereits vergeben.");
            }
        });

        User user = userRepository.findById(userId).orElseThrow();
        user.setUsername(username);
        user.setGender(gender);
        return userRepository.save(user);
    }
}
