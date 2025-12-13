package com.project.block.models;
import org.springframework.stereotype.Service;

import com.project.block.entity.User;
import com.project.block.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void   createUser(User user) {
        /// I must  check  all  Fields  Validation  before  save
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
    public  User loginUser(User user) {
        // Simple login logic (for demonstration )
        User existingUser = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(user.getEmail()) && u.getPassword().equals(user.getPassword()))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        return existingUser;
    }
}
