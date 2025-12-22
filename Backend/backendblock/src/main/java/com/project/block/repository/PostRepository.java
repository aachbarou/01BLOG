package com.project.block.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.block.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.timestamp DESC")
    List<Post> findPostsByUserId(@Param("userId") Long userId);
    
    List<Post> findAllByOrderByTimestampDesc();
}
