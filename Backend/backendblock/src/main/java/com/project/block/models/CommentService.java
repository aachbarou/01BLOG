package com.project.block.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.block.dto.CommentDTO;
import com.project.block.dto.PostDTO;
import com.project.block.dto.UserDTO;
import com.project.block.entity.Comment;
import com.project.block.entity.Post;
import com.project.block.entity.User;
import com.project.block.repository.CommentRepository;
import com.project.block.repository.PostRepository;

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
    
    Post post =  this.postRepository.findById(postId).orElse(null);

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

    public CommentDTO mapToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setTimestamp(comment.getTimestamp());
        
        if (comment.getUser() != null) {
            dto.setUser(new UserDTO(
                comment.getUser().getUser_id(),
                comment.getUser().getUsername(),
                comment.getUser().getUserAvatar(),
                comment.getUser().getRole()
            ));
        }
        return dto;
    }

    public List<CommentDTO> getCommentsDTO(Long postId) {
        return commentRepository.findByPostIdOrderByTimestampDesc(postId).stream()
                .map(this::mapToDTO)
                .toList();
    }
}