package com.project.block.models;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.block.dto.PostDTO;
import com.project.block.dto.UserDTO;
import com.project.block.entity.Like;
import com.project.block.entity.Post;
import com.project.block.entity.User;
import com.project.block.repository.CommentRepository;
import com.project.block.repository.LikeRepository;
import com.project.block.repository.PostRepository;
import com.project.block.repository.Subscrepository;
import com.project.block.entity.Subscription;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository CommentRepository;
    @Value("${file.upload-dir}")
    private String uploadDir;
    private final LikeRepository likeRepository;
    private final NotificationService notificationService;
    private final Subscrepository subscrepository;

    /**
     * Constructor for PostService
     * 
     * @param postRepository Repository for Post entity
     */
    public PostService(PostRepository postRepository, CommentRepository CommentRepository,
            LikeRepository likeRepository, NotificationService notificationService, Subscrepository subscrepository) {
        this.postRepository = postRepository;
        this.CommentRepository = CommentRepository;
        this.likeRepository = likeRepository;
        this.notificationService = notificationService;
        this.subscrepository = subscrepository;
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

    public List<Post> getVisiblePostsByUserId(Long userId) {
        return postRepository.findPostsByUserIdAndStatus(userId, "visible");
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

            if (file.getSize() > 100 * 1024 * 1024) {
                throw new IllegalArgumentException("File size must be less than 100MB.");
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
        post.setStatus("visible");

        postRepository.save(post);

        // Notify followers
        List<Subscription> followers = subscrepository.findByFollowed(currentUser);
        for (Subscription sub : followers) {
            notificationService.createNotification(sub.getFollower(), currentUser, "post",
                    "published a new post: " + post.getTitle());
        }
    }

    public int getHowmanyComments(Long postId) {

        int commentsCount = CommentRepository.findByPostIdOrderByTimestampDesc(postId).size();
        return commentsCount;
    }

    public void updatePost(Long id, PostDTO postDto, org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException {

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

        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());

        if (file != null && !file.isEmpty()) {
            // رفع ملف جديد
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir).resolve(fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            post.setMediaUrl(fileName);
        } else if (postDto.getMediaUrl() != null && !postDto.getMediaUrl().isEmpty()) {
            post.setMediaUrl(postDto.getMediaUrl());
        }

        postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found");
        }
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    /**
     * Get a single post by ID with visibility checks.
     * - If not found → throws RuntimeException("Post not found")
     * - If hidden and user is not owner/admin → throws SecurityException("Access
     * denied")
     * - Otherwise → returns PostDTO
     */
    public PostDTO getVisiblePostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!"visible".equals(post.getStatus())) {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            boolean isOwner = post.getUser() != null
                    && post.getUser().getUser_id().equals(currentUser.getUser_id());
            boolean isAdmin = "admin".equalsIgnoreCase(currentUser.getRole());

            if (!isOwner && !isAdmin) {
                throw new SecurityException("Access denied");
            }
        }

        return mapToDTO(post);
    }

    public boolean canEditPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return post.getUser().getUser_id() == currentUser.getUser_id();
    }

    public boolean canDeletePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return post.getUser().getUser_id() == currentUser.getUser_id();
    }

    public boolean ifPostExists(Long postId) {
        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : " + postId);
        return postRepository.existsById(postId);
    }

    @Transactional
    public boolean toggleLike(Long postId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserAndPost(currentUser, post);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            post.setLikes(Math.max(0, (post.getLikes() != null ? post.getLikes() : 0) - 1));
            postRepository.save(post);
            return false; // Unliked
        } else {
            likeRepository.save(new Like(currentUser, post));
            post.setLikes((post.getLikes() != null ? post.getLikes() : 0) + 1);
            postRepository.save(post);

            if (!post.getUser().getUser_id().equals(currentUser.getUser_id())) {
                notificationService.createNotification(post.getUser(), currentUser, "like",
                        "liked your post \"" + post.getTitle() + "\"");
            }

            return true; // Liked
        }
    }

    public boolean isLikedByCurrentUser(Long postId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Post post = postRepository.findById(postId).orElse(null);
        return post != null && likeRepository.existsByUserAndPost(currentUser, post);
    }

    public PostDTO mapToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setMediaUrl(post.getMediaUrl());
        dto.setTimestamp(com.project.block.util.TimeFormatterUtil.getTimeAgo(post.getTimestamp()));
        dto.setLikes(post.getLikes() != null ? post.getLikes() : 0);
        dto.setComments(getHowmanyComments(post.getId()));
        dto.setLiked(isLikedByCurrentUser(post.getId()));
        dto.setStatus(post.getStatus());

        if (post.getUser() != null) {
            dto.setUser(new UserDTO(
                    post.getUser().getUser_id(),
                    post.getUser().getUsername(),
                    post.getUser().getUserAvatar(),
                    post.getUser().getRole(),
                    post.getUser().getEmail(),
                    post.getUser().isBanned()));
        }
        return dto;
    }

    public List<PostDTO> getAllPostsDTO() {
        return postRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<PostDTO> getAllVisiblePostsDTO() {
        return postRepository.findByStatusOrderByTimestampDesc("visible").stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void updatePostStatus(Long id, String status) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus(status);
        postRepository.save(post);
    }

    public List<PostDTO> getFollowingPostsDTO() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return postRepository.findFollowingPostsByUserId(currentUser.getUser_id(), "visible").stream()
                .map(this::mapToDTO)
                .toList();
    }
}