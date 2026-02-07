package com.school.saas.module.issue.entity;

import com.school.saas.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "issue_comments", indexes = {
    @Index(name = "idx_issue_comment_issue_id", columnList = "issue_id"),
    @Index(name = "idx_issue_comment_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class IssueComment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Column(name = "user_id", nullable = false)
    private UUID userId; // User who made the comment

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;
}
