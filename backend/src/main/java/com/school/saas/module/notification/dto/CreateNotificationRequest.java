package com.school.saas.module.notification.dto;

import com.school.saas.module.notification.entity.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to create a notification")
public class CreateNotificationRequest {

    @NotNull(message = "User ID is required")
    @Schema(description = "User ID", required = true)
    private UUID userId;

    @NotBlank(message = "Title is required")
    @Schema(description = "Notification title", required = true)
    private String title;

    @NotBlank(message = "Message is required")
    @Schema(description = "Notification message", required = true)
    private String message;

    @NotNull(message = "Notification type is required")
    @Schema(description = "Notification type", required = true)
    private NotificationType notificationType;
}
