package com.school.saas.module.document.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "Request to upload a document")
public class UploadDocumentRequest {

    @NotBlank(message = "Entity type is required")
    @Schema(description = "Entity type (student, teacher, payment, etc.)", required = true)
    private String entityType;

    @NotNull(message = "Entity ID is required")
    @Schema(description = "Entity ID", required = true)
    private UUID entityId;

    @NotBlank(message = "Title is required")
    @Schema(description = "Document title", required = true)
    private String title;
}
