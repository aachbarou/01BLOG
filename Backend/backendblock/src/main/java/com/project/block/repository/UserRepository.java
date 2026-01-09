package com.project.block.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.block.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by email
     * 
     * @param email The email to search for
     * @return Optional containing User if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find a user by username
     * 
     * @param username The username to search for
     * @return Optional containing User if found
     */
    Optional<User> findByUsername(String username);

}
