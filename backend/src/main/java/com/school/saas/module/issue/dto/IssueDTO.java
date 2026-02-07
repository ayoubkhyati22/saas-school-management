package com.school.saas.module.issue.dto;

import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueStatus;
import com.school.saas.module.issue.entity.IssueType;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Issue details")
public class IssueDTO {

    @Schema(description = "Issue ID")
    private UUID id;

    @Schema(description = "School ID")
    private UUID schoolId;

    @Schema(description = "User who reported the issue")
    private UUID reportedBy;

    @Schema(description = "User assigned to the issue")
    private UUID assignedTo;

    @Schema(description = "Issue title")
    private String title;

    @Schema(description = "Issue description")
    private String description;

    @Schema(description = "Issue type")
    private IssueType issueType;

    @Schema(description = "Issue priority")
    private IssuePriority priority;

    @Schema(description = "Issue status")
    private IssueStatus status;

    @Schema(description = "Resolution details")
    private String resolution;

    @Schema(description = "Resolved at timestamp")
    private LocalDateTime resolvedAt;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
