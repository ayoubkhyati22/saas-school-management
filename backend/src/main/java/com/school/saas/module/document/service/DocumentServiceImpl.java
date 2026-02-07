package com.school.saas.module.document.service;

import com.school.saas.module.document.dto.DocumentDTO;
import com.school.saas.module.document.entity.Document;
import com.school.saas.module.document.mapper.DocumentMapper;
import com.school.saas.module.document.repository.DocumentRepository;
import com.school.saas.module.subscription.SubscriptionLimitService;
import com.school.saas.security.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final StorageService storageService;
    private final SubscriptionLimitService subscriptionLimitService;
    private final DocumentMapper documentMapper;

    @Override
    @Transactional
    public DocumentDTO uploadDocument(MultipartFile file, String entityType, UUID entityId, String title) {
        UUID schoolId = TenantContext.getTenantId();
        UUID currentUserId = TenantContext.getCurrentUserId();

        // Validate storage limit (convert bytes to MB)
        long fileSizeInMB = file.getSize() / (1024 * 1024);
        subscriptionLimitService.validateStorageLimit(schoolId, fileSizeInMB);

        // Upload file to storage
        String filePath = storageService.uploadFile(file, entityType, entityId, schoolId);

        // Create document record
        Document document = Document.builder()
                .schoolId(schoolId)
                .entityType(entityType)
                .entityId(entityId)
                .title(title)
                .filePath(filePath)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedBy(currentUserId)
                .uploadedAt(LocalDateTime.now())
                .build();

        document = documentRepository.save(document);

        String fileUrl = storageService.generateFileUrl(filePath);
        return documentMapper.toDTOWithUrl(document, fileUrl);
    }

    @Override
    public DocumentDTO getDocumentById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        if (!document.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Document does not belong to this school");
        }

        String fileUrl = storageService.generateFileUrl(document.getFilePath());
        return documentMapper.toDTOWithUrl(document, fileUrl);
    }

    @Override
    public List<DocumentDTO> getDocumentsByEntity(String entityType, UUID entityId) {
        UUID schoolId = TenantContext.getTenantId();

        List<Document> documents = documentRepository.findBySchoolIdAndEntityTypeAndEntityId(
                schoolId, entityType, entityId);

        return documents.stream()
                .map(doc -> {
                    String fileUrl = storageService.generateFileUrl(doc.getFilePath());
                    return documentMapper.toDTOWithUrl(doc, fileUrl);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDTO> getDocumentsBySchool() {
        UUID schoolId = TenantContext.getTenantId();

        List<Document> documents = documentRepository.findBySchoolId(schoolId);

        return documents.stream()
                .map(doc -> {
                    String fileUrl = storageService.generateFileUrl(doc.getFilePath());
                    return documentMapper.toDTOWithUrl(doc, fileUrl);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDocument(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        if (!document.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Document does not belong to this school");
        }

        // Delete file from storage
        storageService.deleteFile(document.getFilePath());

        // Delete document record
        documentRepository.delete(document);

        log.info("Deleted document: {} for school: {}", id, schoolId);
    }

    @Override
    public long getStorageUsed() {
        UUID schoolId = TenantContext.getTenantId();
        return storageService.calculateStorageUsed(schoolId);
    }
}
