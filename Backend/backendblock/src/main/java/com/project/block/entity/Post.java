package com.project.block.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String Content;
    private String mediaUrl;
    private LocalDateTime timestamp;
    @Transient
    private Integer comments;
    
    private Integer likes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> commentsList;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likesList;

    @Transient
    public boolean isLiked;
}
