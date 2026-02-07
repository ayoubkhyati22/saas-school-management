package com.school.saas.module.issue.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to assign an issue to a super admin")
public class AssignIssueRequest {

    @NotNull(message = "Assigned to user ID is required")
    @Schema(description = "Super admin user ID to assign the issue to", required = true)
    private UUID assignedTo;
}
