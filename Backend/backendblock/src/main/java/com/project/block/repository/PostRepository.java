package com.project.block.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.block.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
	
}