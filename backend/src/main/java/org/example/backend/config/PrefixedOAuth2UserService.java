package org.example.backend.config;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PrefixedOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User user = delegate.loadUser(request);

        String regId = request.getClientRegistration().getRegistrationId().toLowerCase();
        Map<String, Object> attrs = new HashMap<>(user.getAttributes());

        String uid;
        if ("google".equals(regId)) {
            uid = "google:" + attrs.getOrDefault("sub", "unknown");
        } else if ("github".equals(regId)) {
            uid = "github:" + attrs.getOrDefault("id", "unknown");
        } else {
            uid = user.getName(); // fallback
        }

        attrs.put("uid", uid);

        return new DefaultOAuth2User(user.getAuthorities(), attrs, "uid");
    }
}
