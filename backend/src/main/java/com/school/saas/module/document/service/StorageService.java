package com.school.saas.module.document.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface StorageService {

    /**
     * Upload a file and return the relative path
     */
    String uploadFile(MultipartFile file, String entityType, UUID entityId, UUID schoolId);

    /**
     * Delete a file by its path
     */
    void deleteFile(String filePath);

    /**
     * Generate a URL to access the file
     */
    String generateFileUrl(String filePath);

    /**
     * Calculate total storage used by a school in bytes
     */
    long calculateStorageUsed(UUID schoolId);
}
