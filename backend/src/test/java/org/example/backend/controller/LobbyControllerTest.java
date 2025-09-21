package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.BackendApplication;
import org.example.backend.model.Lobby;
import org.example.backend.model.PlayerState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = BackendApplication.class)
@AutoConfigureMockMvc
class LobbyControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;

    @Test
    @WithMockUser
    void fullLobbyFlow() throws Exception {
        // 1️⃣ Create Lobby
        String lobbyJson = mockMvc.perform(post("/api/lobbies")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"gameId\":\"gameABC\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Lobby created = mapper.readValue(lobbyJson, Lobby.class);

        // 2️⃣ Player jojn
        PlayerState p = new PlayerState();
        p.setUsername("Bob");
        p.setRole("Doctor");
        mockMvc.perform(post("/api/lobbies/" + created.getId() + "/join")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.players[0].username").value("Bob"));

        // 3️⃣ change Phase
        mockMvc.perform(patch("/api/lobbies/" + created.getId() + "/phase")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phase\":\"NIGHT\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phase").value("NIGHT"));

        // 4️⃣ Change Timer
        mockMvc.perform(patch("/api/lobbies/" + created.getId() + "/timer")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"seconds\":30}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timerSeconds").value(30));

        // 5️⃣ lobby
        mockMvc.perform(get("/api/lobbies/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.players[0].username").value("Bob"))
                .andExpect(jsonPath("$.phase").value("NIGHT"));
    }
}
