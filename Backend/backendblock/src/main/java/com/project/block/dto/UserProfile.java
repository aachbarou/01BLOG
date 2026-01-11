package com.project.block.dto;

import com.project.block.entity.User;
import com.project.block.entity.Post;
import java.util.List;

import lombok.Data;

// export  interface UserProfile {
//     id: string;
//     name: string;
//     avatarUrl: string;
//     bio: string;
//     stats: {
//         posts: number;
//         followers: string;
//         following: number;
//     }; 
// }
@Data
public class UserProfile {
    private Long id;
    private String name;
    private String avatarUrl;
    private String bio;
    private Stats stats;

    @Data
    public static class Stats {
        private List<Post> posts;
        private int followers;
        private int following;

        public Stats(List<Post> posts, int followers, int following) {
            this.posts = posts;
            this.followers = followers;
            this.following = following;
        }
    }

    public UserProfile(User user, List<Post> posts) {
        this.id = user.getUser_id();
        this.name = user.getUsername();
        this.avatarUrl = "https://www.vecteezy.com/vector-art/67754607-flat-avatar-icon-man-user-profile-image-for-social-media-blogs-forums-or-online-work";
        this.bio = " We are a community of people who love to share their thoughts and ideas. We are here to help you find the information you need and to connect with others who share your interests.";
        this.stats = new Stats(posts, 56, 99090);
    }
}
