package com.school.saas.module.document.dto;

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
@Schema(description = "Document details")
public class DocumentDTO {

    @Schema(description = "Document ID")
    private UUID id;

    @Schema(description = "School ID")
    private UUID schoolId;

    @Schema(description = "Entity type (student, teacher, payment, etc.)")
    private String entityType;

    @Schema(description = "Entity ID")
    private UUID entityId;

    @Schema(description = "Document title")
    private String title;

    @Schema(description = "File path")
    private String filePath;

    @Schema(description = "File type (MIME type)")
    private String fileType;

    @Schema(description = "File size in bytes")
    private Long fileSize;

    @Schema(description = "User who uploaded the document")
    private UUID uploadedBy;

    @Schema(description = "Upload timestamp")
    private LocalDateTime uploadedAt;

    @Schema(description = "File URL")
    private String fileUrl;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
