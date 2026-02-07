package com.school.saas.module.notification.service;

import com.school.saas.common.Role;
import com.school.saas.module.notification.dto.CreateNotificationRequest;
import com.school.saas.module.notification.dto.NotificationDTO;
import com.school.saas.module.notification.dto.SendBulkNotificationRequest;
import com.school.saas.module.notification.entity.Notification;
import com.school.saas.module.notification.mapper.NotificationMapper;
import com.school.saas.module.notification.repository.NotificationRepository;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import com.school.saas.security.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional
    public NotificationDTO sendNotification(CreateNotificationRequest request) {
        UUID schoolId = TenantContext.getTenantId();

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("User does not belong to this school");
        }

        Notification notification = Notification.builder()
                .schoolId(schoolId)
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .notificationType(request.getNotificationType())
                .readStatus(false)
                .sentAt(LocalDateTime.now())
                .build();

        notification = notificationRepository.save(notification);
        log.info("Sent notification to user: {}", request.getUserId());

        return notificationMapper.toDTO(notification);
    }

    @Override
    @Transactional
    public List<NotificationDTO> sendBulkNotification(SendBulkNotificationRequest request) {
        UUID schoolId = TenantContext.getTenantId();

        // Find target users
        List<User> targetUsers = new ArrayList<>();

        if (request.getClassroomId() != null) {
            // Send to users in specific classroom
            // This would require additional repository methods
            targetUsers = userRepository.findBySchoolId(schoolId);
            // Filter by classroom (implementation depends on your data model)
        } else if (request.getTargetRole() != null) {
            // Send to all users with specific role
            targetUsers = userRepository.findBySchoolIdAndRole(schoolId, request.getTargetRole());
        } else {
            // Send to all users in the school
            targetUsers = userRepository.findBySchoolId(schoolId);
        }

        List<Notification> notifications = targetUsers.stream()
                .map(user -> Notification.builder()
                        .schoolId(schoolId)
                        .user(user)
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .notificationType(request.getNotificationType())
                        .readStatus(false)
                        .sentAt(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList());

        notifications = notificationRepository.saveAll(notifications);
        log.info("Sent bulk notification to {} users", notifications.size());

        return notifications.stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        if (!notification.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Notification does not belong to this school");
        }

        notification.setReadStatus(true);
        notification.setReadAt(LocalDateTime.now());

        notification = notificationRepository.save(notification);
        return notificationMapper.toDTO(notification);
    }

    @Override
    @Transactional
    public int markAllAsRead(UUID userId) {
        UUID schoolId = TenantContext.getTenantId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("User does not belong to this school");
        }

        int count = notificationRepository.markAllAsReadByUserId(userId, LocalDateTime.now());
        log.info("Marked {} notifications as read for user: {}", count, userId);

        return count;
    }

    @Override
    public long getUnreadCount(UUID userId) {
        UUID schoolId = TenantContext.getTenantId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("User does not belong to this school");
        }

        return notificationRepository.countByUserIdAndReadStatusFalse(userId);
    }

    @Override
    public Page<NotificationDTO> getNotificationsByUser(UUID userId, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("User does not belong to this school");
        }

        Page<Notification> notifications = notificationRepository.findBySchoolIdAndUserId(
                schoolId, userId, pageable);

        return notifications.map(notificationMapper::toDTO);
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        UUID schoolId = TenantContext.getTenantId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("User does not belong to this school");
        }

        List<Notification> notifications = notificationRepository.findUnreadBySchoolIdAndUserId(
                schoolId, userId);

        return notifications.stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteNotification(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        if (!notification.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Notification does not belong to this school");
        }

        notificationRepository.delete(notification);
    }
}
