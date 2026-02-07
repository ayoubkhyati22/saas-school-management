package com.school.saas.module.course;

import com.school.saas.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "course_materials", indexes = {
    @Index(name = "idx_course_material_course_id", columnList = "course_id"),
    @Index(name = "idx_course_material_school_id", columnList = "school_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CourseMaterial extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_type", length = 50)
    private String fileType; // PDF, DOCX, VIDEO, IMAGE, etc.

    @Column(name = "file_size")
    private Long fileSize; // in bytes

    @Column(name = "uploaded_by", nullable = false)
    private UUID uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
}
