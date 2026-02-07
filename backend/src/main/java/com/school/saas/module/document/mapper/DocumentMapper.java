package com.school.saas.module.document.mapper;

import com.school.saas.module.document.dto.DocumentDTO;
import com.school.saas.module.document.entity.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public DocumentDTO toDTO(Document document) {
        if (document == null) {
            return null;
        }

        return DocumentDTO.builder()
                .id(document.getId())
                .schoolId(document.getSchoolId())
                .entityType(document.getEntityType())
                .entityId(document.getEntityId())
                .title(document.getTitle())
                .filePath(document.getFilePath())
                .fileType(document.getFileType())
                .fileSize(document.getFileSize())
                .uploadedBy(document.getUploadedBy())
                .uploadedAt(document.getUploadedAt())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }

    public DocumentDTO toDTOWithUrl(Document document, String fileUrl) {
        DocumentDTO dto = toDTO(document);
        if (dto != null) {
            dto.setFileUrl(fileUrl);
        }
        return dto;
    }
}
