package com.school.saas.module.course.dto;

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
public class CourseMaterialDTO {
    private UUID id;
    private UUID courseId;
    private UUID schoolId;
    private String title;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private UUID uploadedBy;
    private String uploadedByName;
    private LocalDateTime uploadedAt;
    private LocalDateTime createdAt;
}
