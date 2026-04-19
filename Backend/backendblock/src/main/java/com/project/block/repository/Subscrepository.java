package com.project.block.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.block.entity.Subscription;
import com.project.block.entity.User;

public interface Subscrepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByFollowerAndFollowed(User follower, User followed);

    List<Subscription> findByFollowed(User followed);

    int countByFollowed(User followed);

    int countByFollower(User follower);

    @Query("SELECT COUNT(s) > 0 FROM Subscription s WHERE s.follower.user_id = :followerId AND s.followed.user_id = :followedId")
    boolean existsByFollowerIdAndFollowedId(@Param("followerId") Long followerId, @Param("followedId") Long followedId);

    void deleteByFollower(User follower);

    void deleteByFollowed(User followed);
}
