package com.school.saas.module.document.controller;

import com.school.saas.module.document.dto.DocumentDTO;
import com.school.saas.module.document.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Document", description = "Document management endpoints")
public class DocumentController {

    private final DocumentService documentService;

    @Value("${storage.local.base-path:C:/saas-school}")
    private String basePath;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Upload a document", description = "Upload a document for a specific entity")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam("entityType") @NotBlank @Parameter(description = "Entity type (student, teacher, payment, etc.)") String entityType,
            @RequestParam("entityId") @NotNull @Parameter(description = "Entity ID") UUID entityId,
            @RequestParam("title") @NotBlank @Parameter(description = "Document title") String title) {
        DocumentDTO document = documentService.uploadDocument(file, entityType, entityId, title);
        return ResponseEntity.status(HttpStatus.CREATED).body(document);
    }

    @GetMapping("/download")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Download a file", description = "Download a file by its path")
    public ResponseEntity<Resource> downloadFile(@RequestParam("path") String filePath) {
        try {
            Path file = Paths.get(basePath).resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                String filename = file.getFileName().toString();
                String contentType = "application/octet-stream";

                if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                }

                boolean isImage = contentType.startsWith("image/");
                String disposition = isImage ? "inline" : "attachment";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get document by ID")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable UUID id) {
        DocumentDTO document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get documents by entity", description = "Get all documents for a specific entity")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByEntity(
            @PathVariable String entityType,
            @PathVariable UUID entityId) {
        List<DocumentDTO> documents = documentService.getDocumentsByEntity(entityType, entityId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN')")
    @Operation(summary = "Get all documents for the school")
    public ResponseEntity<List<DocumentDTO>> getDocumentsBySchool() {
        List<DocumentDTO> documents = documentService.getDocumentsBySchool();
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Delete a document")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/storage-used")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN')")
    @Operation(summary = "Get total storage used by the school")
    public ResponseEntity<Long> getStorageUsed() {
        long storageUsed = documentService.getStorageUsed();
        return ResponseEntity.ok(storageUsed);
    }
}
