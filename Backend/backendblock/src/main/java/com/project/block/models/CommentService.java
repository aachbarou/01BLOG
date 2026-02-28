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
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public Comment addComment(Long postId, String content) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Post post = this.postRepository.findById(postId).orElse(null);

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setTimestamp(LocalDateTime.now());
        comment.setUser(currentUser);
        comment.setPost(post);

        Comment savedComment = commentRepository.save(comment);

        if (!post.getUser().getUser_id().equals(currentUser.getUser_id())) {
            notificationService.createNotification(post.getUser(), currentUser, "comment",
                    "commented on your post \"" + post.getTitle() + "\"");
        }

        return savedComment;
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByTimestampDesc(postId);
    }

    public CommentDTO mapToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setTimestamp(com.project.block.util.TimeFormatterUtil.getTimeAgo(comment.getTimestamp()));

        if (comment.getUser() != null) {
            dto.setUser(new UserDTO(
                    comment.getUser().getUser_id(),
                    comment.getUser().getUsername(),
                    comment.getUser().getUserAvatar(),
                    comment.getUser().getRole(),
                    comment.getUser().getEmail(),
                    comment.getUser().isBanned()));
        }
        return dto;
    }

    public List<CommentDTO> getCommentsDTO(Long postId) {
        return commentRepository.findByPostIdOrderByTimestampDesc(postId).stream()
                .map(this::mapToDTO)
                .toList();
    }
}