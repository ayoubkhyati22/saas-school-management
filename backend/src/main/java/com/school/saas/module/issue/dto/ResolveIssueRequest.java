package com.school.saas.module.issue.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to resolve an issue")
public class ResolveIssueRequest {

    @NotBlank(message = "Resolution is required")
    @Schema(description = "Resolution details", required = true)
    private String resolution;
}
