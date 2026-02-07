package com.school.saas.module.chat.dto;

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
public class ChatMessageDTO {
    private UUID id;
    private UUID schoolId;
    private UUID courseId;
    private UUID senderId;
    private String senderName;
    private String senderRole;
    private String message;
    private String messageType;
    private String filePath;
    private LocalDateTime timestamp;
    private LocalDateTime createdAt;
}
