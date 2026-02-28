package com.project.block.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Long id;
    private String content;

    private String timestamp;
    private UserDTO user;
}