package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService; // ✅ Mock شده، نیاز به Bean واقعی نیست

    @Test
    void register_ShouldCreateUser_WhenValid() throws Exception {
        // کاربر Mock برای برگشت از UserService
        User mockUser = new User("123", "testuser", "male", false);

        // وقتی متد registerUser صدا زده بشه، mockUser برگردون
        Mockito.when(userService.registerUser("testuser", "male"))
                .thenReturn(mockUser);

        // اجرای درخواست MockMvc
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "testuser", "gender", "male")
                        )))
                .andExpect(status().isCreated())   // ✅ 201 Created
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.gender").value("male"));
    }
}
