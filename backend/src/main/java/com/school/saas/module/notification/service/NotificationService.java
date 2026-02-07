package com.school.saas.module.notification.service;

import com.school.saas.module.notification.dto.CreateNotificationRequest;
import com.school.saas.module.notification.dto.NotificationDTO;
import com.school.saas.module.notification.dto.SendBulkNotificationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    NotificationDTO sendNotification(CreateNotificationRequest request);

    List<NotificationDTO> sendBulkNotification(SendBulkNotificationRequest request);

    NotificationDTO markAsRead(UUID id);

    int markAllAsRead(UUID userId);

    long getUnreadCount(UUID userId);

    Page<NotificationDTO> getNotificationsByUser(UUID userId, Pageable pageable);

    List<NotificationDTO> getUnreadNotifications(UUID userId);

    void deleteNotification(UUID id);
}
