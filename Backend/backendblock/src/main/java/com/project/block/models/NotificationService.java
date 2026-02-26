package com.project.block.models;

import com.project.block.dto.NotificationDTO;
import com.project.block.entity.Notification;
import com.project.block.entity.User;
import com.project.block.repository.NotificationRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(User recipient, User sender, String type, String text) {
        if (recipient.getUser_id().equals(sender.getUser_id())) {
            return null; // Don't notify yourself
        }
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType(type);
        notification.setText(text);
        return notificationRepository.save(notification);
    }

    public List<NotificationDTO> getUserNotifications() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getRecipient().getUser_id().equals(currentUser.getUser_id())) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        });
    }

    @Transactional
    public void markAllAsRead() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Notification> unread = notificationRepository.findByRecipientOrderByCreatedAtDesc(currentUser)
                .stream().filter(n -> !n.isRead()).collect(Collectors.toList());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationDTO mapToDTO(Notification notif) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notif.getId());
        dto.setType(notif.getType());
        dto.setFrom(notif.getSender() != null ? notif.getSender().getUsername() : "System");
        dto.setText(notif.getText());
        dto.setRead(notif.isRead());
        dto.setTime(getTimeAgo(notif.getCreatedAt()));
        return dto;
    }

    private String getTimeAgo(LocalDateTime past) {
        Duration duration = Duration.between(past, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60)
            return seconds + "s ago";
        long minutes = seconds / 60;
        if (minutes < 60)
            return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24)
            return hours + "h ago";
        long days = hours / 24;
        return days + "d ago";
    }
}
