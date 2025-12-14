package com.project.block.models;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.project.block.dto.PostDTO;
import com.project.block.entity.Post;

import com.project.block.repository.PostRepository;

@Service
public class PostService {
    private  final   PostRepository postRepository ;
    public  PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
   public void createPost(PostDTO postDto) {
 
    if (postDto.getTitle() == null || postDto.getTitle().trim().isEmpty()) {
        throw new IllegalArgumentException("Title is required.");
    }
    if (postDto.getTitle().length() < 5 || postDto.getTitle().length() > 100) {
        throw new IllegalArgumentException("Title must be between 5 and 100 characters.");
    }

    if (postDto.getContent() == null || postDto.getContent().trim().isEmpty()) {
        throw new IllegalArgumentException("Content cannot be empty.");
    }
    if (postDto.getContent().length() > 5000) {
        throw new IllegalArgumentException("Content is too long (limit is 5000 characters).");
    }

    if (postDto.getMediaUrl() != null && !postDto.getMediaUrl().trim().isEmpty()) {
        if (postDto.getMediaUrl().length() > 2048) {
            throw new IllegalArgumentException("Image URL is too long.");
        }
        
        if (!postDto.getMediaUrl().startsWith("http")) {
             throw new IllegalArgumentException("Invalid Image URL.");
        }
    }

    // --- 4. XSS Security (Cross-Site Scripting) ---
    // If you want to prevent users from injecting <script> tags:
    if (postDto.getContent().contains("<script>") || postDto.getTitle().contains("<script>")) {
        throw new SecurityException("Invalid content detected.");
    }

    // If all checks pass, save the post
    Post post = new Post();
    post.setTitle(postDto.getTitle());
    post.setContent(postDto.getContent());
    post.setMediaUrl(postDto.getMediaUrl());
    post.setTimestamp(LocalDateTime.now());
    
    postRepository.save(post);
}

}
