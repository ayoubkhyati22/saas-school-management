package com.school.saas.module.issue.entity;

import com.school.saas.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "issues", indexes = {
    @Index(name = "idx_issue_school_id", columnList = "school_id"),
    @Index(name = "idx_issue_reported_by", columnList = "reported_by"),
    @Index(name = "idx_issue_assigned_to", columnList = "assigned_to"),
    @Index(name = "idx_issue_status", columnList = "status"),
    @Index(name = "idx_issue_priority", columnList = "priority")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Issue extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "reported_by", nullable = false)
    private UUID reportedBy; // SCHOOL_ADMIN who reported the issue

    @Column(name = "assigned_to")
    private UUID assignedTo; // SUPER_ADMIN who is handling the issue

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false, length = 30)
    private IssueType issueType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IssuePriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IssueStatus status;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
