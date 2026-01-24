package com.project.block.models;

import com.project.block.entity.Comment;
import com.project.block.entity.Post;
import com.project.block.entity.User;
import com.project.block.repository.CommentRepository;
import com.project.block.repository.PostRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    public CommentService(CommentRepository commentRepository , PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Comment addComment(Long postId, String content) {
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    Post post = this.postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

    Comment comment = new Comment();
    comment.setContent(content);
    comment.setTimestamp(LocalDateTime.now());
    comment.setUser(currentUser);
    comment.setPost(post);

    return commentRepository.save(comment);
}

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByTimestampDesc(postId);
    }
}