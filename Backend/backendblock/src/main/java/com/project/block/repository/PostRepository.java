package com.project.block.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.block.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Find posts by user ID, ordered by timestamp descending
     * 
     * @param userId The User ID
     * @return List of Posts
     */
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.timestamp DESC")
    List<Post> findPostsByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.status = :status ORDER BY p.timestamp DESC")
    List<Post> findPostsByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    /**
     * Find all posts ordered by timestamp descending
     * 
     * @return List of Posts
     */
    List<Post> findAllByOrderByTimestampDesc();

    List<Post> findByStatusOrderByTimestampDesc(String status);
}
