package com.school.saas.module.notification.dto;

import com.school.saas.module.notification.entity.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Notification details")
public class NotificationDTO {

    @Schema(description = "Notification ID")
    private UUID id;

    @Schema(description = "School ID")
    private UUID schoolId;

    @Schema(description = "User ID")
    private UUID userId;

    @Schema(description = "Notification title")
    private String title;

    @Schema(description = "Notification message")
    private String message;

    @Schema(description = "Notification type")
    private NotificationType notificationType;

    @Schema(description = "Read status")
    private Boolean readStatus;

    @Schema(description = "Sent at timestamp")
    private LocalDateTime sentAt;

    @Schema(description = "Read at timestamp")
    private LocalDateTime readAt;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
