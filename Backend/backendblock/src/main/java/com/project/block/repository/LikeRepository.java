package com.project.block.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.block.entity.Like;
import com.project.block.entity.Post;
import com.project.block.entity.User;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    boolean existsByUserAndPost(User user, Post post);
    int countByPost(Post post);
}