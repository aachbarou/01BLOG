package com.project.block.Controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;

import com.project.block.entity.User;
import com.project.block.models.UserService;

import com.project.block.entity.Post;
import java.util.List;
import com.project.block.dto.UserProfile;
import com.project.block.dto.ResposeData;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // get posts of user
        try {
        List<Post> posts = userService.findPostsByUserId(user.getUser_id());
        UserProfile userProfile = new UserProfile(user, posts);
        return ResponseEntity.ok( new  ResposeData("User profile fetched successfully", 200, userProfile));
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
    }
    }
}