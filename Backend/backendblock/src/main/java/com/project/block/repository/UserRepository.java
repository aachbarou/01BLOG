package com.project.block.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.block.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
   
}