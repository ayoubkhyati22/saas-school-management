package com.school.saas.module.issue.dto;

import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to create an issue")
public class CreateIssueRequest {

    @NotBlank(message = "Title is required")
    @Schema(description = "Issue title", required = true)
    private String title;

    @NotBlank(message = "Description is required")
    @Schema(description = "Issue description", required = true)
    private String description;

    @NotNull(message = "Issue type is required")
    @Schema(description = "Issue type", required = true)
    private IssueType issueType;

    @NotNull(message = "Priority is required")
    @Schema(description = "Issue priority", required = true)
    private IssuePriority priority;
}
