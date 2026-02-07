package com.school.saas.module.course.mapper;

import com.school.saas.module.course.CourseMaterial;
import com.school.saas.module.course.dto.CourseMaterialDTO;
import com.school.saas.module.user.User;
import org.springframework.stereotype.Component;

@Component
public class CourseMaterialMapper {

    public CourseMaterialDTO toDTO(CourseMaterial material) {
        if (material == null) {
            return null;
        }

        return CourseMaterialDTO.builder()
                .id(material.getId())
                .courseId(material.getCourse() != null ? material.getCourse().getId() : null)
                .schoolId(material.getSchoolId())
                .title(material.getTitle())
                .filePath(material.getFilePath())
                .fileType(material.getFileType())
                .fileSize(material.getFileSize())
                .uploadedBy(material.getUploadedBy())
                .uploadedAt(material.getUploadedAt())
                .createdAt(material.getCreatedAt())
                .build();
    }

    public CourseMaterialDTO toDTO(CourseMaterial material, User uploadedByUser) {
        CourseMaterialDTO dto = toDTO(material);
        if (dto != null && uploadedByUser != null) {
            dto.setUploadedByName(uploadedByUser.getFirstName() + " " + uploadedByUser.getLastName());
        }
        return dto;
    }
}
