package com.project.block.Controllers;

import com.project.block.dto.ResposeData;
import com.project.block.models.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class FolowController {
    private final SubscriptionService subscriptionService;

    public FolowController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id) {
        try {
            subscriptionService.toggleFollow(id);
            return ResponseEntity.ok(new ResposeData("Follow status updated", 200, null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ResposeData(e.getMessage(), 400, null));
        }
    }
}