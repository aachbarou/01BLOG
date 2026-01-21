package com.project.block.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followed_id")
    private User followed;
}
