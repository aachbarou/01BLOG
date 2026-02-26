package com.project.block.models;

import com.project.block.entity.Subscription;
import com.project.block.entity.User;
import com.project.block.repository.Subscrepository;
import com.project.block.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubscriptionService {
    private final Subscrepository subscrepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public SubscriptionService(Subscrepository subscrepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.subscrepository = subscrepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public void toggleFollow(Long targetUserId) throws Exception {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getUser_id().equals(targetUserId)) {
            throw new Exception("You cannot follow yourself");
        }

        subscrepository.findByFollowerAndFollowed(currentUser, targetUser)
                .ifPresentOrElse(
                        subscrepository::delete,
                        () -> {
                            Subscription sub = new Subscription();
                            sub.setFollower(currentUser);
                            sub.setFollowed(targetUser);
                            subscrepository.save(sub);

                            notificationService.createNotification(targetUser, currentUser, "follow",
                                    "started following you");
                        });
    }

    public int getFollowersCount(User user) {
        return subscrepository.countByFollowed(user);
    }

    public int getFollowingCount(User user) {
        return subscrepository.countByFollower(user);
    }

    public boolean isFollowing(User follower, User followed) {
        return subscrepository.existsByFollowerIdAndFollowedId(follower.getUser_id(), followed.getUser_id());
    }

    @Transactional
    public void deleteAllByUser(User user) {
        subscrepository.deleteByFollower(user);
        subscrepository.deleteByFollowed(user);
    }
}