package com.project.block.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.block.dto.PostDTO;
import com.project.block.dto.ResposeData;
import com.project.block.dto.UserProfile;
import com.project.block.entity.User;
import com.project.block.models.PostService;
import com.project.block.models.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final PostService postService;

    @Value("${app.file-base-url}")
    private String fileBaseUrl;

    public UserController(UserService userService, PostService postService) {
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile() {
        try {
            User currentUser = userService.getUserProfile(null);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResposeData("Unauthorized", 401, null));
            }

            List<PostDTO> postDTOs = userService.findPostsByUserId(currentUser.getUser_id())
                    .stream()
                    .map(postService::mapToDTO)
                    .toList();

            UserProfile userProfile = new UserProfile(
                    currentUser,
                    postDTOs,
                    true,
                    true,
                    userService.getFollowersCount(currentUser),
                    userService.getFollowingCount(currentUser),
                    false,
                    fileBaseUrl);

            return ResponseEntity.ok(new ResposeData("User profile fetched successfully", 200, userProfile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResposeData("Internal Server Error: " + e.getMessage(), 500, null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            User targetUser = userService.getUserProfile(id);
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResposeData("User not found", 404, null));
            }

            List<PostDTO> postDTOs = userService.findPostsByUserId(targetUser.getUser_id())
                    .stream()
                    .map(postService::mapToDTO)
                    .toList();
            UserProfile userProfile = new UserProfile(
                    targetUser,
                    postDTOs,
                    currentUser.getUser_id().equals(id),
                    true,
                    userService.getFollowersCount(targetUser),
                    userService.getFollowingCount(targetUser),
                    userService.isFollowing(currentUser, targetUser),
                    fileBaseUrl);

            return ResponseEntity.ok(new ResposeData("User fetched successfully", 200, userProfile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResposeData("Error: " + e.getMessage(), 500, null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestParam("username") String username,
            @RequestParam("bio") String bio,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            String newToken = userService.updateUserProfile(currentUser, username, bio, file);

            return ResponseEntity.ok(new ResposeData("Profile updated successfully", 200, Map.of("token", newToken)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResposeData("Update failed: " + e.getMessage(), 400, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResposeData("Update failed: " + e.getMessage(), 500, null));
        }
    }
}