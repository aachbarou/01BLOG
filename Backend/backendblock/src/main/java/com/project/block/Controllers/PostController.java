package com.project.block.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.PostDTO;
import com.project.block.dto.ResposeData;
import com.project.block.models.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@org.springframework.web.bind.annotation.ModelAttribute PostDTO post,
            @org.springframework.web.bind.annotation.RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        try {
            postService.createPost(post, file);
            return ResponseEntity.ok(new ResposeData("Post  Created  Seccess...", 200, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("hada  hwa  error "+e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }

    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(new ResposeData("Posts fetched successfully", 200, postService.getAllPosts()));
    }

    @GetMapping("/User/{userId}")
    public ResponseEntity<?> getUserPosts(@PathVariable Long user_id) {
        return ResponseEntity
                .ok(new ResposeData("Posts fetched successfully", 200, postService.getPostsByUserId(user_id)));
    }

}
