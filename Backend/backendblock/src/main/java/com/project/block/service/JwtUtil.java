package com.project.block.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;

import com.project.block.entity.User;
import org.springframework.stereotype.Service;

import com.project.block.entity.Token;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Map;

@Service
public class JwtUtil {

    private static final String SECRET_KEY = "my-super-long-secret-key-that-is-at-least-32-bytes";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

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

        // 2. Create the Token Entity using the constructor you defined
        Token token = new Token(jwtToken, user);

        return token;
    }
}
