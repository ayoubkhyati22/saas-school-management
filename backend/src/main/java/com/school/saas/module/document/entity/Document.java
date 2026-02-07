package com.school.saas.module.document.entity;

import com.school.saas.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_document_school_id", columnList = "school_id"),
    @Index(name = "idx_document_entity_type", columnList = "entity_type"),
    @Index(name = "idx_document_entity_id", columnList = "entity_id"),
    @Index(name = "idx_document_uploaded_by", columnList = "uploaded_by")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Document extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // "student", "teacher", "payment", "absence", etc.

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_type", nullable = false, length = 100)
    private String fileType; // MIME type

    @Column(name = "file_size", nullable = false)
    private Long fileSize; // in bytes

    @Column(name = "uploaded_by", nullable = false)
    private UUID uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
}
