package org.example.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicEndpoints_ShouldBeAccessible() throws Exception {
        // /api/user → باید همیشه accessible باشه
        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk());

        // GET روی /register → باید خطای 4xx بده
        mockMvc.perform(get("/api/users/register"))
                .andExpect(status().is4xxClientError());

        // POST روی /register با داده‌ی ناقص → باید 400 بده (چون validation fail میشه)
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"bad name\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void protectedEndpoints_ShouldRequireAuth() throws Exception {
        // endpoint فرضی protected
        mockMvc.perform(get("/api/protected-test"))
                .andExpect(status().is3xxRedirection()); // ریدایرکت به لاگین
    }
}
