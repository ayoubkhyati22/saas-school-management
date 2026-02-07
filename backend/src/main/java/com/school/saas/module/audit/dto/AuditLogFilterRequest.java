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
public class AuditLogFilterRequest {

    private UUID schoolId;
    private UUID userId;
    private String action;
    private String entityType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
