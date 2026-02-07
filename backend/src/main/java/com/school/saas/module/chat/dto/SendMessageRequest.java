package com.school.saas.module.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {

    @NotNull(message = "Course ID is required")
    private UUID courseId;

    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message must not exceed 5000 characters")
    private String message;

    @NotBlank(message = "Message type is required")
    @Pattern(regexp = "TEXT|FILE|IMAGE", message = "Message type must be TEXT, FILE, or IMAGE")
    private String messageType;

    private String filePath;
}
