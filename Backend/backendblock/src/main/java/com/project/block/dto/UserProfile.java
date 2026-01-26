package com.project.block.dto;

import java.util.List;

import com.project.block.entity.Post;
import com.project.block.entity.User;

import lombok.Data;

@Data
public class UserProfile {
    private Long id;
    private String name;
    private String avatarUrl;
    private String email;
    private String bio;
    private Stats stats;
    private boolean isOwned;
    private boolean isFollowing;

    @Data
    public static class Stats {
        private List<Post> posts;
        private int followers;
        private int following;
        private String role;

        public Stats(List<Post> posts, int followers, int following, String role, boolean Needposts) {
            this.posts = Needposts ? posts : null;
            this.followers = followers;
            this.following = following;
            this.role = role;

        }
    }

    public UserProfile(User user, List<Post> posts, boolean isOwned, boolean Needposts, int followers, int following,
            boolean isFollowing) {
        this.id = user.getUser_id();
        this.name = user.getUsername();
        this.email = user.getEmail();
        this.isOwned = isOwned;
        this.isFollowing = isFollowing;
        this.avatarUrl = user.getUserAvatar() != null && !user.getUserAvatar().isEmpty()
        ? "http://localhost:8080/files/" + user.getUserAvatar()
        : "https://ui-avatars.com/api/?name=" + user.getUsername();

        this.bio = user.getStatus();
        this.stats = new Stats(posts, followers, following, user.getRole(), Needposts);
    }
}
