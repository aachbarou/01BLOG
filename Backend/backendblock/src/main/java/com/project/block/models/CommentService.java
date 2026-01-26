package com.project.block.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.block.entity.Comment;
import com.project.block.entity.User;
import com.project.block.repository.CommentRepository;
import com.project.block.repository.PostRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    public CommentService(CommentRepository commentRepository , PostRepository postRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment addComment(Long postId, String content) {
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    

    Comment comment = new Comment();
    comment.setContent(content);
    comment.setTimestamp(LocalDateTime.now());
    comment.setUser(currentUser);

    return commentRepository.save(comment);
}

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByTimestampDesc(postId);
    }
}