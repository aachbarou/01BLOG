package com.project.block.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.block.dto.PostDTO;
import com.project.block.entity.Post;
import com.project.block.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;

    @org.springframework.beans.factory.annotation.Value("${file.upload-dir}")
    private String uploadDir;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findPostsByUserId(userId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByTimestampDesc();
    }

    public void createPost(PostDTO postDto, org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException {

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

        String mediaUrl = null;
        if (file != null && !file.isEmpty()) {
            // Create the upload directory if it doesn't exist
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            // Generate a unique filename
            String fileName = java.util.UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadPath.resolve(fileName);

            // Save the file
            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Set the media URL (relative path or full URL depending on how you serve it)
            // For now, storing the filename/path. You might want to prepend a serving URL
            // later.
            mediaUrl = fileName;
        } else if (postDto.getMediaUrl() != null && !postDto.getMediaUrl().trim().isEmpty()) {
            // Fallback to URL if provided and no file uploaded
            if (postDto.getMediaUrl().length() > 2048) {
                throw new IllegalArgumentException("Image URL is too long.");
            }
            if (!postDto.getMediaUrl().startsWith("http")) {
                throw new IllegalArgumentException("Invalid Image URL.");
            }
            mediaUrl = postDto.getMediaUrl();
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
        post.setMediaUrl(mediaUrl);
        post.setTimestamp(LocalDateTime.now());

        postRepository.save(post);
    }

}
