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
}