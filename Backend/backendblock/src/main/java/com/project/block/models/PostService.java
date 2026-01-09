package com.project.block.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.block.dto.PostDTO;
import com.project.block.entity.Post;
import com.project.block.entity.User;
import com.project.block.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Constructor for PostService
     * 
     * @param postRepository Repository for Post entity
     */
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /**
     * Retrieve all posts created by a specific user
     * 
     * @param userId The ID of the user
     * @return List of Posts
     */
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findPostsByUserId(userId);
    }

    /**
     * Retrieve all posts ordered by timestamp descending
     * 
     * @return List of Posts
     */
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByTimestampDesc();
    }

    /**
     * Create a new post with optional file upload
     * 
     * @param postDto Data transfer object containing post details
     * @param file    Optional file to be uploaded with the post
     * @throws java.io.IOException If file upload fails
     */
    public void createPost(PostDTO postDto, MultipartFile file) throws java.io.IOException {

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (postDto.getTitle() == null || postDto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required.");
        }
        if (postDto.getTitle().length() < 5 || postDto.getTitle().length() > 40) {
            throw new IllegalArgumentException("Title must be between 5 and 40 characters.");
        }

        if (postDto.getContent() == null || postDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content cannot be empty.");
        }
        if (postDto.getContent().length() > 1000) {
            throw new IllegalArgumentException("Content is too long (limit is 1000 characters).");
        }

        String mediaUrl = null;
        if (file != null && !file.isEmpty()) {

            if (file.getSize() > 10 * 1024 * 1024) {
                throw new IllegalArgumentException("File size must be less than 10MB.");
            }

            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
                throw new IllegalArgumentException("Only images and videos are allowed.");
            }

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            mediaUrl = fileName;
        } else if (postDto.getMediaUrl() != null && !postDto.getMediaUrl().trim().isEmpty()) {
            if (postDto.getMediaUrl().length() > 2048) {
                throw new IllegalArgumentException("Image URL is too long.");
            }
            if (!postDto.getMediaUrl().startsWith("http")) {
                throw new IllegalArgumentException("Invalid Image URL.");
            }
            mediaUrl = postDto.getMediaUrl();
        }

        if (postDto.getContent().contains("<script>") || postDto.getTitle().contains("<script>")) {
            throw new SecurityException("Invalid content detected.");
        }

        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setMediaUrl(mediaUrl);
        post.setTimestamp(LocalDateTime.now());
        post.setUser(currentUser);

        postRepository.save(post);
    }
}