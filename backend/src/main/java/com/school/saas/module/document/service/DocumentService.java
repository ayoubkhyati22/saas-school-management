package com.school.saas.module.document.service;

import com.school.saas.module.document.dto.DocumentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface DocumentService {

    DocumentDTO uploadDocument(MultipartFile file, String entityType, UUID entityId, String title);

    DocumentDTO getDocumentById(UUID id);

    List<DocumentDTO> getDocumentsByEntity(String entityType, UUID entityId);

    List<DocumentDTO> getDocumentsBySchool();

    void deleteDocument(UUID id);

    long getStorageUsed();
}
