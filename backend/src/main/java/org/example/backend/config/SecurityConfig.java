package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserService userService;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBase;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> {})
                .csrf(c -> c.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/", "/index.html",
                                "/static/**", "/assets/**",
                                "/oauth2/**", "/login/**",
                                "/api/users/register",
                                "/api/user"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            AuthInfo info = (authentication instanceof OAuth2AuthenticationToken token)
                                    ? extractAuthInfo(token)
                                    : new AuthInfo(authentication.getName(), null, null);

                            User user = userService.saveOrUpdateOAuthUser(info.userId(), info.firstName(), info.avatarUrl());
                            response.sendRedirect(frontendBase + (user.isAcceptedAgb() ? "/game" : "/agb"));
                        })
                )
                .logout(logout -> logout.logoutSuccessUrl(frontendBase + "/").permitAll());

        return http.build();
    }

    /* -------------------- helpers (reduced complexity) -------------------- */

    private AuthInfo extractAuthInfo(OAuth2AuthenticationToken token) {
        String provider = safeLower(token.getAuthorizedClientRegistrationId());
        Map<String, Object> attrs = ((DefaultOAuth2User) token.getPrincipal()).getAttributes();

        return switch (provider) {
            case "google" -> authFromGoogle(attrs);
            case "github" -> authFromGithub(attrs);
            default -> new AuthInfo(token.getName(), null, null);
        };
    }

    private AuthInfo authFromGoogle(Map<String, Object> attrs) {
        String sub = asString(attrs.get("sub"));
        String userId = sub != null ? "google:" + sub : null;

        String firstName = firstNonBlank(
                asString(attrs.get("given_name")),
                firstWord(asString(attrs.get("name")))
        );

        String avatar = asString(attrs.get("picture"));
        return new AuthInfo(nullSafe(userId, "google:unknown"), firstName, avatar);
    }

    private AuthInfo authFromGithub(Map<String, Object> attrs) {
        String id = asString(attrs.get("id"));
        String userId = id != null ? "github:" + id : null;

        String name = firstNonBlank(asString(attrs.get("name")), asString(attrs.get("login")));
        String firstName = firstWord(name);

        String avatar = asString(attrs.get("avatar_url"));
        return new AuthInfo(nullSafe(userId, "github:unknown"), firstName, avatar);
    }

    private static String firstWord(String s) {
        if (s == null || s.isBlank()) return null;
        String[] parts = s.trim().split("\\s+");
        return parts.length > 0 ? parts[0] : null;
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) return a;
        if (b != null && !b.isBlank()) return b;
        return null;
    }

    private static String asString(Object obj) {
        return obj == null ? null : obj.toString();
    }

    private static String safeLower(String s) {
        return s == null ? "" : s.toLowerCase();
    }

    private static String nullSafe(String value, String fallback) {
        return value == null ? fallback : value;
    }

    private record AuthInfo(String userId, String firstName, String avatarUrl) {}

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
