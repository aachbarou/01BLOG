package com.project.block.Controllers;

import com.project.block.dto.CommentDTO;
import com.project.block.dto.ResposeData;
import com.project.block.entity.Comment;
import com.project.block.models.CommentService;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.project.block.models.PostService;

import lombok.Data;

@RestController
@RequestMapping("/api/comments")
@Data
public class CommentController {
    private final CommentService commentService;
    private final PostService postService;

    // public CommentController(CommentService commentService , PostService
    // postService) {
    // this.postService = postService;
    // this.commentService = commentService;

    // }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsForPost(@PathVariable Long postId) {
        try {
            List<CommentDTO> comments = commentService.getCommentsDTO(postId);
            return ResponseEntity.ok(new ResposeData("Comments fetched successfully", 200, comments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResposeData("Error", 500, null));
        }
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> postComment(@PathVariable Long postId, @RequestBody String content) {
        try {
            String cleanContent = content.replace("\"", "").trim();
            // we must Check the Post Exits in the postRepository before adding a comment
            if (!this.postService.ifPostExists(postId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResposeData("Post not found", 404, null));
            }
            if (cleanContent.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResposeData("Comment content cannot be empty", 400, null));
            }

            Comment savedComment = commentService.addComment(postId, cleanContent);
            CommentDTO savedCommentDTO = commentService.mapToDTO(savedComment);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResposeData("Comment added successfully", 201, savedCommentDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResposeData("Error: " + e.getMessage(), 400, null));
        }
    }
}