package com.school.saas.module.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {

    private UUID id;
    private UUID schoolId;
    private UUID userId;
    private String username;
    private String action;
    private String entityType;
    private UUID entityId;
    private String oldValue;
    private String newValue;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;
    private LocalDateTime createdAt;
}
