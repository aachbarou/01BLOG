package com.project.block.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.project.block.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    // ── Change this to your admin email ──
    private static final String ADMIN_EMAIL = "ahmedachbarou@gmail.com";

    public AdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        userRepository.findByEmail(ADMIN_EMAIL).ifPresent(user -> {
            if (!"ADMIN".equals(user.getRole())) {
                user.setRole("ADMIN");
                userRepository.save(user);
                System.out.println("✅ User '" + user.getUsername() + "' promoted to ADMIN");
            } else {
                System.out.println("ℹ️  User '" + user.getUsername() + "' is already ADMIN");
            }
        });
    }
}
