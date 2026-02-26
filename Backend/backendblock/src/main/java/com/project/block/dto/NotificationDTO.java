package com.project.block.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class NotificationDTO {
    private Long id;
    private String type;
    private String from;
    private String text;
    private String time;

    @JsonProperty("isRead")
    private boolean isRead;
}
