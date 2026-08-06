package com.aurelia.jewellery.security.jwt;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private final JwtUtils jwtUtils;

    public JwtTokenProvider(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    public String generateToken(Authentication authentication) {
        return jwtUtils.generateJwtToken(authentication);
    }

    public String generateTokenFromUsername(String username) {
        return jwtUtils.generateTokenFromUsername(username);
    }

    public String getUsernameFromJwtToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }

    public boolean validateJwtToken(String authToken) {
        return jwtUtils.validateJwtToken(authToken);
    }
}
