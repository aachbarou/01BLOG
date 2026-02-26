package com.project.block.dto;

import java.util.List;
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
        private List<PostDTO> posts;
        private int followers;
        private int following;
        private String role;

        public Stats(List<PostDTO> posts, int followers, int following, String role, boolean Needposts) {
            this.posts = Needposts ? posts : null;
            this.followers = followers;
            this.following = following;
            this.role = role;
        }
    }

    public UserProfile(com.project.block.entity.User user, List<PostDTO> posts, boolean isOwned, boolean Needposts,
            int followers, int following,
            boolean isFollowing, String fileBaseUrl) {
        this.id = user.getUser_id();
        this.name = user.getUsername();
        this.email = user.getEmail();
        this.isOwned = isOwned;
        this.isFollowing = isFollowing;
        this.avatarUrl = user.getUserAvatar() != null && !user.getUserAvatar().isEmpty()
                ? fileBaseUrl + user.getUserAvatar()
                : "https://ui-avatars.com/api/?name=" + user.getUsername();

        this.bio = user.getStatus();
        this.stats = new Stats(posts, followers, following, user.getRole(), Needposts);
    }
}