package org.example.backend.controller;

import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = MeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(MeControllerTest.Config.class)
class MeControllerTest {

    @TestConfiguration
    static class Config {
        @Bean
        UserService userService() {
            return Mockito.mock(UserService.class);
        }
    }

    @Autowired private MockMvc mockMvc;
    @Autowired private UserService userService;

    @Test
    void shouldReturnUnauthenticated_WhenNoAuth() throws Exception {
        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false));
    }

    @Test
    @WithMockUser(username = "existingUser")
    void shouldReturnUser_WhenAuthValid() throws Exception {
        User user = new User("existingUser", "testuser", "male", true, "Ali", "https://example.com/avatar.png");
        given(userService.findById("existingUser")).willReturn(Optional.of(user));

        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.gender").value("male"))
                .andExpect(jsonPath("$.user.firstName").value("Ali"))
                .andExpect(jsonPath("$.user.avatarUrl").value("https://example.com/avatar.png"));
    }

    @Test
    @WithMockUser(username = "notfound")
    void shouldReturn404_WhenUserNotFound() throws Exception {
        given(userService.findById("notfound")).willReturn(Optional.empty());

        mockMvc.perform(get("/api/user"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User not found"));
    }
}
