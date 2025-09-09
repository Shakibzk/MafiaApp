package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
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
                            String userId = authentication.getName();

                            if (authentication instanceof OAuth2AuthenticationToken token) {
                                String provider = token.getAuthorizedClientRegistrationId();
                                Map<String, Object> attrs = ((DefaultOAuth2User) token.getPrincipal()).getAttributes();

                                if ("google".equalsIgnoreCase(provider)) {
                                    Object sub = attrs.get("sub");
                                    if (sub != null) {
                                        userId = "google:" + sub.toString();
                                    }
                                } else if ("github".equalsIgnoreCase(provider)) {
                                    Object gid = attrs.get("id");
                                    if (gid != null) {
                                        userId = "github:" + gid.toString();
                                    }
                                }
                            }

                            User user = userService.saveOAuthUserIfNotExists(userId);

                            if (!user.isAcceptedAgb()) {
                                response.sendRedirect("http://localhost:5173/agb");
                            } else {
                                // بعد از AGB یا اگر قبلاً تایید کرده → مستقیم به Game
                                response.sendRedirect("http://localhost:5173/game");
                            }
                        })
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("http://localhost:5173/")
                        .permitAll()
                );

        return http.build();
    }

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
