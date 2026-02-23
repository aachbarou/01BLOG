package com.project.block.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g. "user", "post"
    private String reason;
    private String reporter; // username of the reporter
    private Long targetId; // ID of the reported user or post
    private String status; // "pending", "resolved"

    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (timestamp == null)
            timestamp = LocalDateTime.now();
        if (status == null)
            status = "pending";
    }
}
