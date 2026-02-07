package com.school.saas.module.document.service;

import com.school.saas.module.document.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocalStorageServiceImpl implements StorageService {

    @Value("${storage.local.base-path:/tmp/school-storage}")
    private String basePath;

    @Value("${storage.max-file-size:10485760}") // 10MB default
    private long maxFileSize;

    private final DocumentRepository documentRepository;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    @Override
    public String uploadFile(MultipartFile file, String entityType, UUID entityId, UUID schoolId) {
        validateFile(file);

        try {
            // Create directory structure: base-path/school_{schoolId}/{entityType}/{entityId}/
            String relativePath = String.format("school_%s/%s/%s",
                    schoolId.toString(), entityType, entityId.toString());
            Path directoryPath = Paths.get(basePath, relativePath);

            // Create directories if they don't exist
            Files.createDirectories(directoryPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Full file path
            Path filePath = directoryPath.resolve(filename);

            // Copy file to destination
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path for database storage
            return relativePath + "/" + filename;

        } catch (IOException e) {
            log.error("Failed to upload file", e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path fullPath = Paths.get(basePath, filePath);
            Files.deleteIfExists(fullPath);
            log.info("Deleted file: {}", filePath);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }

    @Override
    public String generateFileUrl(String filePath) {
        // In a real application, this would return a proper URL
        // For now, returning a simple path that could be served by a controller
        return "/api/documents/download/" + filePath;
    }

    @Override
    public long calculateStorageUsed(UUID schoolId) {
        Long totalBytes = documentRepository.sumFileSizeBySchoolId(schoolId);
        return totalBytes != null ? totalBytes : 0L;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum allowed size of %d bytes", maxFileSize));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "File type not allowed. Allowed types: " + String.join(", ", ALLOWED_CONTENT_TYPES));
        }
    }
}
