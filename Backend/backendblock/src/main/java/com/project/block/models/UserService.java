package com.project.block.models;

import org.springframework.stereotype.Service;

import com.project.block.entity.Token;
import com.project.block.entity.User;
import com.project.block.repository.TokenRepository;
import com.project.block.repository.UserRepository;
import com.project.block.service.JwtUtil;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TokenRepository TokenRepository;
    private final JwtUtil JwtUtil;

    public UserService(UserRepository userRepository, TokenRepository TokenRepository, JwtUtil JwtUtil) {
        this.TokenRepository = TokenRepository;
        this.JwtUtil = JwtUtil;
        this.userRepository = userRepository;
    }

    public void createUser(User user) {
        /// I must check all Fields Validation before save
        if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Username, email, and password must not be null");
        }
        if (user.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        // Set default role and status
        user.setRole("USER");
        user.setStatus("Active");
        userRepository.save(user);
    }

    public User loginUser(User user) {
        String inputEmailOrUsername = user.getEmail() != null ? user.getEmail().trim() : "";
        String inputPassword = user.getPassword() != null ? user.getPassword().trim() : "";

        System.out.println("Login Attempt:");
        System.out.println("Input Identity: '" + inputEmailOrUsername + "'");
        System.out.println("Input Password: '" + inputPassword + "'");

        // Try finding by email first
        User existingUser = userRepository.findByEmail(inputEmailOrUsername)
                .orElse(null);

        if (existingUser != null) {
            System.out.println(
                    "Found user by EMAIL: " + existingUser.getUsername() + " (ID: " + existingUser.getUser_id() + ")");
        }

        // If not found by email, try finding by username (treating user.getEmail() as
        // username input)
        if (existingUser == null) {
            existingUser = userRepository.findByUsername(inputEmailOrUsername)
                    .orElse(null);

            if (existingUser != null) {
                System.out.println("Found user by USERNAME: " + existingUser.getUsername() + " (ID: "
                        + existingUser.getUser_id() + ")");
            } else {
                System.out.println("User NOT FOUND by Email or Username.");
                throw new IllegalArgumentException("Invalid email/username or password");
            }
        }

        // Verify password
        // WARNING: Storing passwords in plain text is insecure. Use BCrypt in
        // production.
        System.out.println("DB Password: '" + existingUser.getPassword() + "'");

        if (!existingUser.getPassword().equals(inputPassword)) {
            System.out.println("Password Mismatch!");
            throw new IllegalArgumentException("Invalid email/username or password");
        }

        System.out.println("Login SUCCESS!");
        return existingUser;
    }

    public String GenerateNewToken(User user) {
        Token jwtToken = this.JwtUtil.generateToken(user);
        if (jwtToken == null || jwtToken.token == null || jwtToken.token.trim().isEmpty()) {
            throw new IllegalStateException("JWT generation failed: token is null or empty");
        }
        if (jwtToken.user == null) {
            jwtToken.user = user;
        }
        try {
            this.TokenRepository.save(jwtToken);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save token: " + e.getMessage(), e);
        }

        return jwtToken.token;
    }
}
