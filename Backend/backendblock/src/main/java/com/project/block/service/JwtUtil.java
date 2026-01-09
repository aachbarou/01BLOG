package com.project.block.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.project.block.entity.Token;
import com.project.block.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtUtil {

    private static final String SECRET_KEY = "my-super-long-secret-key-that-is-at-least-32-bytes";

    /**
     * Retrieve the signing key
     * 
     * @return The signing key
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    /**
     * Generate a new token for a user
     * 
     * @param user The user to generate token for
     * @return The generated Token entity
     */
    public Token generateToken(User user) {

        String jwtToken;
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", user.getRole());
            claims.put("id", user.getUser_id());
            jwtToken = Jwts.builder()
                    .setClaims(claims)
                    .setSubject(user.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Error generating JWT token: " + e.getMessage());
        }

        Token token = new Token(jwtToken, user);

        return token;
    }

    /**
     * Extract all claims from token
     * 
     * @param token The JWT token
     * @return All claims
     */
    public Claims extractAllClaims(String token) {

        Claims cl = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return cl;
    }

    /**
     * Extract username from token
     * 
     * @param token The JWT token
     * @return The username
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Check if token is expired
     * 
     * @param token The JWT token
     * @return True if expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        Date exp = extractAllClaims(token).getExpiration();
        return exp.before(new Date());
    }

    /**
     * Validate token against user
     * 
     * @param token The JWT token
     * @param user  The user to validate against
     * @return True if valid, false otherwise
     */
    public boolean validateToken(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUsername()) && !isTokenExpired(token));
    }
}
