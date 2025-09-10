package org.example.backend.service;

import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_ShouldSave_WhenUsernameIsUnique() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User saved = userService.registerUser("testuser", "male");

        assertEquals("testuser", saved.getUsername());
        assertEquals("male", saved.getGender());
        assertFalse(saved.isAcceptedAgb());
        assertNull(saved.getFirstName());
        assertNull(saved.getAvatarUrl());
    }

    @Test
    void registerUser_ShouldThrow_WhenUsernameExists() {
        when(userRepository.findByUsername("duplicate"))
                .thenReturn(Optional.of(new User("1", "duplicate", "male", false, null, null)));

        assertThrows(IllegalArgumentException.class,
                () -> userService.registerUser("duplicate", "male"));
    }

    @Test
    void saveOrUpdateOAuthUser_ShouldCreate_WhenNotFound() {
        when(userRepository.findById("google:123")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.saveOrUpdateOAuthUser("google:123", "Ali", "http://pic");

        assertEquals("google:123", result.getId());
        assertNull(result.getUsername());
        assertEquals("Ali", result.getFirstName());
        assertEquals("http://pic", result.getAvatarUrl());
        assertFalse(result.isAcceptedAgb());
    }

    @Test
    void saveOrUpdateOAuthUser_ShouldReturnExisting_WhenFound() {
        User existing = new User("github:456", "shakib", "male", true, "Shakib", "http://avatar");
        when(userRepository.findById("github:456")).thenReturn(Optional.of(existing));

        User result = userService.saveOrUpdateOAuthUser("github:456", "NewName", "http://new");

        assertSame(existing, result);
        assertEquals("Shakib", result.getFirstName());
        assertEquals("http://avatar", result.getAvatarUrl());
        assertTrue(result.isAcceptedAgb());
    }

    @Test
    void acceptAgb_ShouldSetAcceptedTrue() {
        User user = new User("1", "ali", "male", false, null, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.acceptAgb("1");

        assertTrue(updated.isAcceptedAgb());
    }

    @Test
    void updateUsername_ShouldUpdate_WhenUnique() {
        User user = new User("1", "oldName", "male", false, null, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.findByUsername("newName")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.updateUsername("1", "newName", "female");

        assertEquals("newName", updated.getUsername());
        assertEquals("female", updated.getGender());
    }

    @Test
    void updateUsername_ShouldThrow_WhenUsernameTakenByOther() {
        User user = new User("1", "oldName", "male", false, null, null);
        User another = new User("2", "newName", "female", false, null, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.findByUsername("newName")).thenReturn(Optional.of(another));

        assertThrows(IllegalArgumentException.class,
                () -> userService.updateUsername("1", "newName", "female"));
    }
}
