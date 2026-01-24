package com.project.block.Controllers;

import com.project.block.dto.ResposeData;
import com.project.block.entity.Comment;
import com.project.block.models.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsForPost(@PathVariable Long postId) {
        try {
            List<Comment> comments = commentService.getCommentsByPostId(postId);
            
            comments.forEach(comment -> {
                if (comment.getUser() != null) {
                    comment.getUser().setEmail(null);
                    comment.getUser().setPassword(null);
                }
            });

            return ResponseEntity.ok(new ResposeData("Comments fetched successfully", 200, comments));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResposeData("Error fetching comments: " + e.getMessage(), 500, null));
        }
    }


    @PostMapping("/post/{postId}")
public ResponseEntity<?> postComment(@PathVariable Long postId, @RequestBody String content) {
    try {
        String cleanContent = content.replace("\"", "").trim();
        Comment savedComment = commentService.addComment(postId, cleanContent);
        
        if (savedComment.getUser() != null) {
            savedComment.getUser().setEmail(null);
            savedComment.getUser().setPassword(null);
        }
        
        return ResponseEntity.ok(new ResposeData("Comment added successfully", 200, savedComment));
    } catch (Exception e) {
        return ResponseEntity.status(400).body(new ResposeData("Error: " + e.getMessage(), 400, null));
    }
}
}