package com.project.block.dto;

import lombok.Data;

@Data
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String mediaUrl;
    private String timestamp;
    private Integer likes;
    private Integer comments;
    private boolean isLiked;
    private String status;
    private UserDTO user;
}