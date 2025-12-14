package com.project.block.Controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.PostDTO;
import com.project.block.models.PostService;

@RestController
@RequestMapping("/Posts")
public class PostController {
    private final PostService postService;
    public PostController(PostService postService) {
        this.postService = postService;
    }
    @PostMapping("/Create")
    public  ResponseEntity<?> createPost(@RequestBody PostDTO post) {
        System.out.println("Received Post: " + post);
        try {
            postService.createPost(post);
            return ResponseEntity.status(201).build(); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage()); 
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error"); 
        }
        
    }
}
