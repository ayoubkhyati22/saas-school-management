package com.school.saas.module.audit.service;

import com.school.saas.module.audit.dto.AuditLogDTO;
import com.school.saas.module.audit.dto.AuditLogFilterRequest;
import com.school.saas.module.audit.entity.AuditLog;
import com.school.saas.module.audit.mapper.AuditLogMapper;
import com.school.saas.module.audit.repository.AuditLogRepository;
import com.school.saas.security.TenantContext;
import com.school.saas.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String action, String entityType, UUID entityId, String oldValue, String newValue) {
        logActionWithDetails(action, entityType, entityId, oldValue, newValue, null, null);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logActionWithDetails(String action, String entityType, UUID entityId, String oldValue, String newValue,
                                    String ipAddress, String userAgent) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
                log.debug("No authenticated user found, skipping audit log");
                return;
            }

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            UUID userId = userPrincipal.getId();
            String username = userPrincipal.getUsername();
            UUID schoolId = TenantContext.getTenantId();

            AuditLog auditLog = AuditLog.builder()
                .schoolId(schoolId)
                .userId(userId)
                .username(username)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .timestamp(LocalDateTime.now())
                .build();

            auditLogRepository.save(auditLog);
            log.debug("Audit log created: action={}, entityType={}, entityId={}, user={}",
                     action, entityType, entityId, username);

        } catch (Exception e) {
            log.error("Failed to create audit log: action={}, entityType={}, entityId={}",
                     action, entityType, entityId, e);
            // Don't throw exception to avoid disrupting the main operation
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAuditLogs(AuditLogFilterRequest filters, Pageable pageable) {
        log.info("Fetching audit logs with filters: {}", filters);

        Page<AuditLog> auditLogs = auditLogRepository.findByFilters(
            filters.getSchoolId(),
            filters.getUserId(),
            filters.getAction(),
            filters.getEntityType(),
            filters.getStartDate(),
            filters.getEndDate(),
            pageable
        );

        return auditLogs.map(auditLogMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAuditLogsBySchool(UUID schoolId, Pageable pageable) {
        log.info("Fetching audit logs for school: {}", schoolId);
        Page<AuditLog> auditLogs = auditLogRepository.findBySchoolId(schoolId, pageable);
        return auditLogs.map(auditLogMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAuditLogsByUser(UUID userId, Pageable pageable) {
        log.info("Fetching audit logs for user: {}", userId);
        Page<AuditLog> auditLogs = auditLogRepository.findByUserId(userId, pageable);
        return auditLogs.map(auditLogMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAuditLogsByEntity(String entityType, UUID entityId, Pageable pageable) {
        log.info("Fetching audit logs for entity: type={}, id={}", entityType, entityId);
        Page<AuditLog> auditLogs = auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable);
        return auditLogs.map(auditLogMapper::toDTO);
    }
}
