package com.project.block.models;

import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.block.entity.Post;
import com.project.block.entity.Report;
import com.project.block.entity.User;
import com.project.block.repository.PostRepository;
import com.project.block.repository.ReportRepository;
import com.project.block.repository.UserRepository;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository,
            PostRepository postRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Report createReport(String type, Long targetId, String reason) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (type == null || targetId == null || reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Type, targetId, and reason are required.");
        }

        if (!type.equals("user") && !type.equals("post")) {
            throw new IllegalArgumentException("Report type must be 'user' or 'post'.");
        }

        if (type.equals("user")) {
            Optional<User> targetUser = userRepository.findById(targetId);
            if (targetUser.isEmpty()) {
                throw new IllegalArgumentException("User not found.");
            }
        } else if (type.equals("post")) {
            Optional<Post> targetPost = postRepository.findById(targetId);
            if (targetPost.isEmpty()) {
                throw new IllegalArgumentException("Post not found.");
            }
        }

        Report report = new Report();
        report.setType(type);
        report.setTargetId(targetId);
        report.setReason(reason);
        report.setReporter(currentUser.getUsername());

        return reportRepository.save(report);
    }
}
