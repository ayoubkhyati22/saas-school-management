package com.school.saas.module.audit.service;

import com.school.saas.module.audit.dto.AuditLogDTO;
import com.school.saas.module.audit.dto.AuditLogFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AuditService {

    void logAction(String action, String entityType, UUID entityId, String oldValue, String newValue);

    void logActionWithDetails(String action, String entityType, UUID entityId, String oldValue, String newValue,
                             String ipAddress, String userAgent);

    Page<AuditLogDTO> getAuditLogs(AuditLogFilterRequest filters, Pageable pageable);

    Page<AuditLogDTO> getAuditLogsBySchool(UUID schoolId, Pageable pageable);

    Page<AuditLogDTO> getAuditLogsByUser(UUID userId, Pageable pageable);

    Page<AuditLogDTO> getAuditLogsByEntity(String entityType, UUID entityId, Pageable pageable);
}
