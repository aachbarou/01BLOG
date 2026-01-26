package com.project.block.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.block.dto.ResposeData;
import com.project.block.dto.UserProfile;
import com.project.block.entity.Post;
import com.project.block.entity.User;
import com.project.block.models.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile() {
        try {
            User user = userService.getUserProfile(null);
            // get posts of user
            try {
                List<Post> posts = userService.findPostsByUserId(user.getUser_id());
                UserProfile userProfile = new UserProfile(user, posts, true, false, userService.getFollowersCount(user), userService.getFollowingCount(user), userService.isFollowing(user, user));
               return ResponseEntity.ok( new  ResposeData("User profile fetched successfully", 200, userProfile));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    // Controle  to get  user  with  id 
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            try {
                User user = userService.getUserProfile(id); 
                UserProfile userProfile = new UserProfile(user , userService.findPostsByUserId(user.getUser_id()) , currentUser.getUser_id().equals(id) , true , userService.getFollowersCount(user), userService.getFollowingCount(user), userService.isFollowing(currentUser, user));
                return ResponseEntity.ok(new ResposeData("User fetched successfully", 200, userProfile));
            } catch (Exception e) {
                return ResponseEntity.status(404).body("User not found");
            }
        } catch ( RuntimeException e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestParam("username") String username,
            @RequestParam("bio") String bio,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            userService.updateUserProfile(currentUser, username, bio, file);
            
            return ResponseEntity.ok(new ResposeData("Profile updated successfully", 200, null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ResposeData("Update failed: " + e.getMessage(), 400, null));
        }
    }
}