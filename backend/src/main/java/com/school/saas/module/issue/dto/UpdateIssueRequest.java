package com.school.saas.module.issue.dto;

import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to update an issue")
public class UpdateIssueRequest {

    @Schema(description = "Issue title")
    private String title;

    @Schema(description = "Issue description")
    private String description;

    @Schema(description = "Issue type")
    private IssueType issueType;

    @Schema(description = "Issue priority")
    private IssuePriority priority;
}
