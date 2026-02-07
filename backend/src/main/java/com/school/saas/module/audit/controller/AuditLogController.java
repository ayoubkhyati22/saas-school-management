package com.school.saas.module.audit.controller;

import com.school.saas.dto.PageResponse;
import com.school.saas.module.audit.dto.AuditLogDTO;
import com.school.saas.module.audit.dto.AuditLogFilterRequest;
import com.school.saas.module.audit.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Audit Log Management APIs")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AuditLogController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get audit logs with filters", description = "Get paginated audit logs with optional filters")
    public ResponseEntity<PageResponse<AuditLogDTO>> getAuditLogs(
            @RequestParam(required = false) UUID schoolId,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Pageable pageable) {

        AuditLogFilterRequest filters = AuditLogFilterRequest.builder()
            .schoolId(schoolId)
            .userId(userId)
            .action(action)
            .entityType(entityType)
            .startDate(startDate != null ? java.time.LocalDateTime.parse(startDate) : null)
            .endDate(endDate != null ? java.time.LocalDateTime.parse(endDate) : null)
            .build();

        Page<AuditLogDTO> auditLogs = auditService.getAuditLogs(filters, pageable);
        return ResponseEntity.ok(PageResponse.of(auditLogs, "Audit logs fetched successfully"));
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get audit logs by school", description = "Get audit logs for a specific school")
    public ResponseEntity<PageResponse<AuditLogDTO>> getAuditLogsBySchool(
            @PathVariable UUID schoolId,
            Pageable pageable) {
        Page<AuditLogDTO> auditLogs = auditService.getAuditLogsBySchool(schoolId, pageable);
        return ResponseEntity.ok(PageResponse.of(auditLogs, "School audit logs fetched successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get audit logs by user", description = "Get audit logs for a specific user")
    public ResponseEntity<PageResponse<AuditLogDTO>> getAuditLogsByUser(
            @PathVariable UUID userId,
            Pageable pageable) {
        Page<AuditLogDTO> auditLogs = auditService.getAuditLogsByUser(userId, pageable);
        return ResponseEntity.ok(PageResponse.of(auditLogs, "User audit logs fetched successfully"));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get audit logs by entity", description = "Get audit logs for a specific entity")
    public ResponseEntity<PageResponse<AuditLogDTO>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable UUID entityId,
            Pageable pageable) {
        Page<AuditLogDTO> auditLogs = auditService.getAuditLogsByEntity(entityType, entityId, pageable);
        return ResponseEntity.ok(PageResponse.of(auditLogs, "Entity audit logs fetched successfully"));
    }
}
