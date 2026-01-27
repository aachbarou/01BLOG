package com.project.block.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project.block.entity.Token;
import com.project.block.entity.User;


@Repository
public  interface TokenRepository extends  JpaRepository<Token, Long> {
    @Modifying
    @Transactional
    void deleteByUser(User user);
}
