package com.school.saas.module.issue.dto;

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
@Schema(description = "Issue comment details")
public class IssueCommentDTO {

    @Schema(description = "Comment ID")
    private UUID id;

    @Schema(description = "Issue ID")
    private UUID issueId;

    @Schema(description = "User who made the comment")
    private UUID userId;

    @Schema(description = "Comment text")
    private String comment;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
