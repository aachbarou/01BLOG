package com.project.block.Controllers;

import com.project.block.dto.ReportDTO;
import com.project.block.dto.ResposeData;
import com.project.block.dto.UserDTO;
import com.project.block.entity.Post;
import com.project.block.entity.Report;
import com.project.block.entity.User;
import com.project.block.models.PostService;
import com.project.block.models.UserService;
import com.project.block.repository.PostRepository;
import com.project.block.repository.ReportRepository;
import com.project.block.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final PostService postService;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public AdminController(UserService userService, PostService postService,
            ReportRepository reportRepository, UserRepository userRepository,
            PostRepository postRepository) {
        this.userService = userService;
        this.postService = postService;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    // ── Helper: get current admin's ID ──
    private Long getCurrentUserId() {
        User current = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return current.getUser_id();
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(new ResposeData("Users fetched", 200, users));
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> toggleBanUser(@PathVariable Long id) {
        // Admin cannot ban themselves
        if (id.equals(getCurrentUserId())) {
            return ResponseEntity.badRequest()
                    .body(new ResposeData("You cannot ban yourself", 400, null));
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isBanned()) {
            userService.unbanUser(user);
            return ResponseEntity.ok(new ResposeData("User unbanned successfully", 200, "Active"));
        } else {
            userService.banUser(user);
            return ResponseEntity.ok(new ResposeData("User banned successfully", 200, "Banned"));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Admin cannot delete themselves
        if (id.equals(getCurrentUserId())) {
            // Check if another admin exists
            long adminCount = userRepository.countByRole("ADMIN");
            if (adminCount <= 1) {
                return ResponseEntity.badRequest()
                        .body(new ResposeData("Cannot delete yourself — you are the only admin", 400, null));
            }
        }
        userService.deleteUser(id);
        return ResponseEntity.ok(new ResposeData("User deleted successfully", 200, null));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(new ResposeData("All posts fetched", 200, postService.getAllPostsDTO()));
    }

    @PutMapping("/posts/{id}/status")
    public ResponseEntity<?> changePostStatus(@PathVariable Long id, @RequestParam String status) {
        postService.updatePostStatus(id, status);
        return ResponseEntity.ok(new ResposeData("Post status updated to " + status, 200, null));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(new ResposeData("Post deleted by admin", 200, null));
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        List<Report> reports = reportRepository.findAllByOrderByTimestampDesc();
        List<ReportDTO> dtos = reports.stream().map(this::mapReportToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ResposeData("Reports fetched", 200, dtos));
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<?> resolveReport(@PathVariable Long id) {
        reportRepository.deleteById(id);
        return ResponseEntity.ok(new ResposeData("Report dismissed", 200, null));
    }

    private ReportDTO mapReportToDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setType(report.getType());
        dto.setReason(report.getReason());
        dto.setReporter(report.getReporter());
        dto.setTargetId(report.getTargetId());
        dto.setTimestamp(report.getTimestamp() != null
                ? com.project.block.util.TimeFormatterUtil.getTimeAgo(report.getTimestamp())
                : null);
        dto.setStatus(report.getStatus());

        // Resolve reporter user
        Optional<User> reporterOpt = userRepository.findByUsername(report.getReporter());
        reporterOpt.ifPresent(user -> dto.setReporterUser(new UserDTO(
                user.getUser_id(), user.getUsername(), user.getUserAvatar(),
                user.getRole(), user.getEmail(), user.isBanned())));

        // Resolve target based on type
        if ("user".equals(report.getType())) {
            Optional<User> targetOpt = userRepository.findById(report.getTargetId());
            targetOpt.ifPresent(user -> dto.setTargetUser(new UserDTO(
                    user.getUser_id(), user.getUsername(), user.getUserAvatar(),
                    user.getRole(), user.getEmail(), user.isBanned())));
        } else if ("post".equals(report.getType())) {
            Optional<Post> postOpt = postRepository.findById(report.getTargetId());
            postOpt.ifPresent(post -> dto.setTargetPostTitle(post.getTitle()));
        }

        return dto;
    }
}