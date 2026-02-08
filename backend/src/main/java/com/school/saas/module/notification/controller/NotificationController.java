package com.school.saas.module.notification.controller;

import com.school.saas.module.notification.dto.CreateNotificationRequest;
import com.school.saas.module.notification.dto.NotificationDTO;
import com.school.saas.module.notification.dto.SendBulkNotificationRequest;
import com.school.saas.module.notification.service.NotificationService;
import com.school.saas.security.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "Notification management endpoints")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Send notification to a single user", description = "School admins can send notifications")
    public ResponseEntity<NotificationDTO> sendNotification(@Valid @RequestBody CreateNotificationRequest request) {
        NotificationDTO notification = notificationService.sendNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }

    @PostMapping("/send-bulk")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Send bulk notifications", description = "Send notifications to multiple users by role or classroom")
    public ResponseEntity<List<NotificationDTO>> sendBulkNotification(@Valid @RequestBody SendBulkNotificationRequest request) {
        List<NotificationDTO> notifications = notificationService.sendBulkNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notifications);
    }

    @PutMapping("/{id}/mark-read")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable UUID id) {
        NotificationDTO notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/mark-all-read")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Mark all notifications as read for current user")
    public ResponseEntity<Integer> markAllAsRead() {
        UUID currentUserId = TenantContext.getCurrentUserId();
        int count = notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get unread notifications for current user")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        UUID currentUserId = TenantContext.getCurrentUserId();
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(currentUserId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get unread notification count for current user")
    public ResponseEntity<Long> getUnreadCount() {
        UUID currentUserId = TenantContext.getCurrentUserId();
        long count = notificationService.getUnreadCount(currentUserId);
        return ResponseEntity.ok(count);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get notifications for current user (paginated)")
    public ResponseEntity<Page<NotificationDTO>> getNotifications(Pageable pageable) {
        UUID currentUserId = TenantContext.getCurrentUserId();
        Page<NotificationDTO> notifications = notificationService.getNotificationsByUser(currentUserId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get notifications for a specific user (paginated)", description = "School admins only")
    public ResponseEntity<Page<NotificationDTO>> getNotificationsByUser(
            @PathVariable UUID userId,
            Pageable pageable) {
        Page<NotificationDTO> notifications = notificationService.getNotificationsByUser(userId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
