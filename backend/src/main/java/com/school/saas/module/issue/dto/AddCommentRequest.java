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
@Schema(description = "Request to add a comment to an issue")
public class AddCommentRequest {

    @NotBlank(message = "Comment is required")
    @Schema(description = "Comment text", required = true)
    private String comment;
}
