package com.project.block.dto;

import lombok.Data;

@Data
public class ReportDTO {
    private Long id;
    private String type;
    private String reason;
    private String reporter;
    private Long targetId;
    private String timestamp;
    private String status;

    // Enriched fields
    private UserDTO reporterUser;
    private UserDTO targetUser; 
    private String targetPostTitle; 
}
