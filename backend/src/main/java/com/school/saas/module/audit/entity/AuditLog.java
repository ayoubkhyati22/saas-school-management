package com.school.saas.module.audit.entity;

import com.school.saas.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_school_id", columnList = "school_id"),
    @Index(name = "idx_audit_user_id", columnList = "user_id"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entity_type", columnList = "entity_type"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AuditLog extends BaseEntity {

    @Column(name = "school_id")
    private UUID schoolId; // Nullable for SUPER_ADMIN actions

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, length = 50)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.

    @Column(name = "entity_type", length = 50)
    private String entityType; // STUDENT, TEACHER, PAYMENT, COURSE, etc.

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
