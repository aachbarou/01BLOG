package com.project.block.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.PostDTO;
import com.project.block.entity.Post;
import com.project.block.models.PostService;

@RestController
@RequestMapping("api/Posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/Create")
    public ResponseEntity<?> createPost(@RequestBody PostDTO post) {
        // System.out.println("Received Post: " + post);
        try {
            postService.createPost(post);
            return ResponseEntity.ok("Post  Created  Seccess...") ;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }

    }

    @GetMapping("/")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/User/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable Long user_id) {
        return ResponseEntity.ok(postService.getPostsByUserId(user_id));
    }


}
