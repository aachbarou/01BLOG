package com.project.block.models;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;

import com.project.block.entity.Post;
import com.project.block.entity.Token;
import com.project.block.entity.User;
import com.project.block.repository.PostRepository;
import com.project.block.repository.TokenRepository;
import com.project.block.repository.UserRepository;
import com.project.block.service.JwtUtil;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TokenRepository TokenRepository;
    private final PostRepository postRepository;
    private final JwtUtil JwtUtil;

    /**
     * Constructor for UserService
     * 
     * @param userRepository  Repository for User entity
     * @param TokenRepository Repository for Token entity
     * @param JwtUtil         Utility for JWT operations
     * @param postRepository  Repository for Post entity
     */
    public UserService(UserRepository userRepository, TokenRepository TokenRepository, JwtUtil JwtUtil , PostRepository postRepository) {
        this.TokenRepository = TokenRepository;
        this.JwtUtil = JwtUtil;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    /**
     * Create a new user with validation
     * 
     * @param user User entity to create
     */
    public void createUser(User user) {

        if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Username, email, and password must not be null");
        }
        if (user.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        user.setRole("USER");
        user.setStatus("Active");
        userRepository.save(user);
    }

    /**
     * Authenticate a user
     * 
     * @param user User entity containing login credentials
     * @return Authenticated User entity
     */
    public User loginUser(User user) {
        String inputEmailOrUsername = user.getEmail() != null ? user.getEmail().trim() : "";
        String inputPassword = user.getPassword() != null ? user.getPassword().trim() : "";

        System.out.println("Login Attempt:");
        System.out.println("Input Identity: '" + inputEmailOrUsername + "'");
        System.out.println("Input Password: '" + inputPassword + "'");

        User existingUser = userRepository.findByEmail(inputEmailOrUsername)
                .orElse(null);

        if (existingUser != null) {
            System.out.println(
                    "Found user by EMAIL: " + existingUser.getUsername() + " (ID: " + existingUser.getUser_id() + ")");
        }

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

        System.out.println("DB Password: '" + existingUser.getPassword() + "'");

        if (!existingUser.getPassword().equals(inputPassword)) {
            System.out.println("Password Mismatch!");
            throw new IllegalArgumentException("Invalid email/username or password");
        }

        System.out.println("Login SUCCESS!");
        return existingUser;
    }

    /**
     * Generate a new JWT token for a user
     * 
     * @param user User (must be persisted)
     * @return Generated token string
     */
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

    public User getUserProfile() {
       try {
        // get user from security context
        com.project.block.entity.User user = (com.project.block.entity.User) 
            org.springframework.security.core.context.SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
            return user;
       } catch (Exception e) {
           throw new RuntimeException("Failed to get user profile: " + e.getMessage(), e);
       }
    }
    public List<Post> findPostsByUserId(Long userId) {
        return this.postRepository.findPostsByUserId(userId);
    }
}
