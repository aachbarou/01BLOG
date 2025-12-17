package com.project.block.service;
import java.security.Key;
import java.util.Date;
import com.project.block.entity.User;
import org.springframework.stereotype.Service;

import com.project.block.entity.Token;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtUtil {

    private  static  String SECRET_KEY = "Tazmamart";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

   public Token generateToken(User user) {
    
    // 1. Generate the JWT String first
    String jwtToken = Jwts.builder()
            .setSubject(user.getUsername()) 
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();

    // 2. Create the Token Entity using the constructor you defined
    Token token = new Token(jwtToken, user);
    
    return token;
}
}