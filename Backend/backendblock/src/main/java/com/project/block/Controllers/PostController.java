package com.project.block.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.PostDTO;
import com.project.block.dto.ResposeData;
import com.project.block.entity.Post;
import com.project.block.entity.User;
import com.project.block.models.PostService;
import com.project.block.repository.LikeRepository;
import com.project.block.repository.PostRepository;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    /**
     * Constructor for PostController
     * 
     * @param postService Service for handling post operations
     */
    public PostController(PostService postService , PostRepository postRepository , LikeRepository likeRepository) {
        this.postService = postService;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;

    }

    /**
     * Endpoint to create a new post
     * 
     * @param post the post data
     * @param file optional file upload
     * @return ResponseEntity with status
     */
    @PostMapping
    public ResponseEntity<?> createPost(@org.springframework.web.bind.annotation.ModelAttribute PostDTO post,
            @org.springframework.web.bind.annotation.RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        try {
            postService.createPost(post, file);
            return ResponseEntity.ok(new ResposeData("Post  Created  Seccess...", 200, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("hada  hwa  error " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }

    }

    /**
     * Endpoint to get all posts
     * 
     * @return ResponseEntity containing all posts
     */
   @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<PostDTO> posts = postService.getAllPostsDTO();
            return ResponseEntity.ok(new ResposeData("Posts fetched successfully", 200, posts));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResposeData("Error", 500, null));
        }
    }

    /**
     * Endpoint to get posts by user ID
     * 
     * @param user_id ID of the user
     * @return ResponseEntity containing user's posts
     */
    @GetMapping("/User/{userId}")
    public ResponseEntity<?> getUserPosts(@PathVariable Long userId) {
        
        return ResponseEntity.ok(new ResposeData("Posts fetched successfully", 200, postService.getPostsByUserId(userId)));
    }

    @PutMapping("/{id}")
    public  ResponseEntity<?> updatePost(@PathVariable Long id , @org.springframework.web.bind.annotation.ModelAttribute PostDTO post){
        // The  user  must  edit  Just  own  posts
        try  {
            if (!postService.canEditPost(id)) {
                return ResponseEntity.status(403).body(new ResposeData("You are not allowed to edit this post", 403, null));
            }
        }catch (Exception e) {
            return ResponseEntity.status(404).body(new ResposeData("404 Not Found", 404, null));
        }
       
        try {
            postService.updatePost(id, post);
            return ResponseEntity.ok(new ResposeData("Post updated successfully", 200, null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResposeData("Internal Server Error" + e.getMessage(), 500, null));
        }
    }   

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id){
         try  {
            if (!postService.canDeletePost(id)) {
                return ResponseEntity.status(403).body(new ResposeData("You are not allowed to delete this post", 403, null));
            }
        }catch (Exception e) {
            return ResponseEntity.status(404).body(new ResposeData("404 Not Found", 404, null));
        }
        try {
            postService.deletePost(id);
            return ResponseEntity.ok(new ResposeData("Post deleted successfully", 200, null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResposeData("Internal Server Error" + e.getMessage(), 500, null));
        }
    }   
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id){
        try {
            return ResponseEntity.ok(new ResposeData("Post fetched successfully", 200, postService.getPostById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResposeData("Internal Server Error" + e.getMessage(), 500, null));
        }
    }   


    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        try {
            boolean liked = postService.toggleLike(id);
            return ResponseEntity.ok(new ResposeData(liked ? "Liked" : "Unliked", 200, liked));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
        public boolean isLikedByCurrentUser(Long postId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Post post = postRepository.findById(postId).orElse(null);
        return post != null && likeRepository.existsByUserAndPost(currentUser, post);
        }
}
