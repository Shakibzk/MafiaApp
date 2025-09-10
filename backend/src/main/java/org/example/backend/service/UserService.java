package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.util.ValidationUtil;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(String username, String gender) {
        if (!ValidationUtil.isValidUsername(username)) {
            throw new IllegalArgumentException("Der Nutzername darf keine Leerzeichen oder Sonderzeichen enthalten.");
        }
        userRepository.findByUsername(username).ifPresent(u -> {
            throw new IllegalArgumentException("Dieser Benutzername ist bereits vergeben.");
        });
        User newUser = new User(null, username, gender, false, null, null);
        return userRepository.save(newUser);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User saveOrUpdateOAuthUser(String userId, String firstName, String avatarUrl) {
        return userRepository.findById(userId)
                .map(existing -> {
                    boolean changed = false;
                    if ((existing.getFirstName() == null || existing.getFirstName().isBlank())
                            && firstName != null && !firstName.isBlank()) {
                        existing.setFirstName(firstName);
                        changed = true;
                    }
                    if ((existing.getAvatarUrl() == null || existing.getAvatarUrl().isBlank())
                            && avatarUrl != null && !avatarUrl.isBlank()) {
                        existing.setAvatarUrl(avatarUrl);
                        changed = true;
                    }
                    return changed ? userRepository.save(existing) : existing;
                })
                .orElseGet(() -> userRepository.save(
                        new User(userId, null, null, false, firstName, avatarUrl)
                ));
    }

    public User acceptAgb(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setAcceptedAgb(true);
        return userRepository.save(user);
    }

    public User updateUsername(String userId, String username, String gender) {
        if (!ValidationUtil.isValidUsername(username)) {
            throw new IllegalArgumentException("Der Nutzername darf keine Leerzeichen oder Sonderzeichen enthalten.");
        }
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
