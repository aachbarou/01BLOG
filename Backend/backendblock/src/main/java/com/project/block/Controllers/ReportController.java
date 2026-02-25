package com.project.block.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.ResposeData;
import com.project.block.entity.Report;
import com.project.block.models.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody ReportRequest request) {
        try {
            Report report = reportService.createReport(request.getType(), request.getTargetId(), request.getReason());
            return ResponseEntity.status(201).body(new ResposeData("Report submitted successfully", 201, report));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ResposeData(e.getMessage(), 400, null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ResposeData("Failed to submit report: " + e.getMessage(), 500, null));
        }
    }

    public static class ReportRequest {
        private String type;
        private Long targetId;
        private String reason;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Long getTargetId() {
            return targetId;
        }

        public void setTargetId(Long targetId) {
            this.targetId = targetId;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
