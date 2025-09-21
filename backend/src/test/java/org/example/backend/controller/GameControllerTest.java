package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.BackendApplication;
import org.example.backend.model.Game;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = BackendApplication.class)
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;

    @Test
    @WithMockUser
    void createAndFetchGame() throws Exception {
        Game g = new Game();
        g.setPlayerCount(6);
        g.setNames(List.of("Alice", "Bob"));
        g.setRoles(List.of("Citizen", "Godfather"));
        g.setAssignments(Map.of("Alice","Citizen","Bob","Godfather"));

        String body = mapper.writeValueAsString(g);

        // POST با توکن CSRF
        String json = mockMvc.perform(post("/api/game")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Game created = mapper.readValue(json, Game.class);

        mockMvc.perform(get("/api/game/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerCount").value(6));
    }
}
