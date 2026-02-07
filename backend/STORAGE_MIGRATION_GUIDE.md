# Storage Migration Guide

## Overview

The School SaaS Platform uses a flexible storage architecture that supports both local file storage and cloud storage providers like AWS S3. This guide explains the current setup and provides step-by-step instructions for migrating to AWS S3.

---

## Current Storage Architecture

### Local Storage Configuration

**Storage Interface:**
```java
public interface StorageService {
    String uploadFile(MultipartFile file, String entityType, UUID entityId, UUID schoolId);
    void deleteFile(String filePath);
    String generateFileUrl(String filePath);
    long calculateStorageUsed(UUID schoolId);
}
```

**Default Implementation:** `LocalStorageServiceImpl`

**Storage Location:**
- Base Path: `C:\saas-school` (Windows) or `/saas-school` (Linux/Mac)
- Configurable via environment variable: `STORAGE_PATH`

### Folder Structure

```
C:\saas-school\
├── school_{school-uuid-1}\
│   ├── STUDENT\
│   │   ├── {student-uuid-1}\
│   │   │   ├── {unique-id}.pdf
│   │   │   └── {unique-id}.jpg
│   │   └── {student-uuid-2}\
│   │       └── {unique-id}.pdf
│   ├── TEACHER\
│   │   └── {teacher-uuid-1}\
│   │       ├── {unique-id}.pdf
│   │       └── {unique-id}.pdf
│   ├── COURSE\
│   │   └── {course-uuid-1}\
│   │       └── {unique-id}.pdf
│   └── PAYMENT\
│       └── {payment-uuid-1}\
│           └── {unique-id}.pdf
└── school_{school-uuid-2}\
    └── ...
```

### Benefits of This Structure

1. **Multi-Tenancy**: Each school's data is isolated in separate folders
2. **Easy Backup**: Can backup individual schools or entire storage
3. **Clear Organization**: Entity types are clearly separated
4. **Migration Ready**: Same structure can be replicated in S3
5. **Simple Discovery**: Easy to find all files for a specific entity

---

## Configuration

### Environment Variables

**Current (Local Storage):**
```bash
STORAGE_PATH=C:/saas-school
```

**Application Properties (application.yml):**
```yaml
storage:
  local:
    base-path: ${STORAGE_PATH:C:/saas-school}
  max-file-size: 10485760  # 10MB in bytes

spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

---

## Migrating to AWS S3

### Step 1: Add AWS S3 Dependencies

Add to your `pom.xml`:

```xml
<!-- AWS SDK for S3 -->
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-s3</artifactId>
    <version>1.12.529</version>
</dependency>

<!-- Or use AWS SDK v2 (recommended) -->
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.20.26</version>
</dependency>
```

### Step 2: Create AWS S3 Configuration

Create `S3Config.java`:

```java
package com.school.saas.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("s3")  // Only activate when 's3' profile is active
public class S3Config {

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.secret-key}")
    private String secretKey;

    @Bean
    public AmazonS3 amazonS3() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);

        return AmazonS3ClientBuilder
                .standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }
}
```

### Step 3: Create S3 Storage Implementation

Create `S3StorageServiceImpl.java`:

```java
package com.school.saas.module.document.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Primary
@Profile("s3")  // Only activate when 's3' profile is active
@RequiredArgsConstructor
@Slf4j
public class S3StorageServiceImpl implements StorageService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${storage.max-file-size:10485760}")
    private long maxFileSize;

    private final AmazonS3 s3Client;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
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
            // Generate S3 key with same structure as local storage
            String key = String.format("school_%s/%s/%s/%s",
                    schoolId.toString(),
                    entityType,
                    entityId.toString(),
                    generateUniqueFilename(file));

            // Create metadata
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // Upload to S3
            PutObjectRequest putRequest = new PutObjectRequest(
                    bucketName,
                    key,
                    file.getInputStream(),
                    metadata
            );

            s3Client.putObject(putRequest);

            log.info("Uploaded file to S3: {}", key);
            return key;

        } catch (IOException e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            s3Client.deleteObject(bucketName, filePath);
            log.info("Deleted file from S3: {}", filePath);
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", filePath, e);
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }

    @Override
    public String generateFileUrl(String filePath) {
        // Generate pre-signed URL valid for 1 hour
        Date expiration = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, filePath)
                        .withMethod(com.amazonaws.HttpMethod.GET)
                        .withExpiration(expiration);

        return s3Client.generatePresignedUrl(generatePresignedUrlRequest).toString();
    }

    @Override
    public long calculateStorageUsed(UUID schoolId) {
        String prefix = "school_" + schoolId.toString() + "/";

        long totalSize = 0;
        ObjectListing objectListing = s3Client.listObjects(bucketName, prefix);

        do {
            for (S3ObjectSummary objectSummary : objectListing.getObjectSummaries()) {
                totalSize += objectSummary.getSize();
            }
            objectListing = s3Client.listNextBatchOfObjects(objectListing);
        } while (objectListing.isTruncated());

        return totalSize;
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

    private String generateUniqueFilename(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        return UUID.randomUUID().toString() + extension;
    }
}
```

### Step 4: Update Application Configuration

Add to `application.yml`:

```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}  # Default to local storage

---
# Local Storage Profile
spring:
  config:
    activate:
      on-profile: local

storage:
  local:
    base-path: ${STORAGE_PATH:C:/saas-school}
  max-file-size: 10485760

---
# AWS S3 Profile
spring:
  config:
    activate:
      on-profile: s3

aws:
  s3:
    bucket-name: ${AWS_S3_BUCKET:school-saas-storage}
    region: ${AWS_REGION:us-east-1}
    access-key: ${AWS_ACCESS_KEY}
    secret-key: ${AWS_SECRET_KEY}

storage:
  max-file-size: 10485760
```

### Step 5: Set Environment Variables

**For Local Storage (Default):**
```bash
SPRING_PROFILES_ACTIVE=local
STORAGE_PATH=C:/saas-school
```

**For AWS S3:**
```bash
SPRING_PROFILES_ACTIVE=s3
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY=your-access-key-id
AWS_SECRET_KEY=your-secret-access-key
```

### Step 6: Create S3 Bucket

Using AWS CLI:

```bash
# Create bucket
aws s3 mb s3://your-bucket-name --region us-east-1

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
  --bucket your-bucket-name \
  --versioning-configuration Status=Enabled

# Set lifecycle policy (optional - for automatic cleanup)
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-bucket-name \
  --lifecycle-configuration file://lifecycle-policy.json
```

**lifecycle-policy.json:**
```json
{
  "Rules": [
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      }
    }
  ]
}
```

### Step 7: Set Bucket Permissions

Create IAM policy for your application:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
      ]
    }
  ]
}
```

### Step 8: Migrate Existing Files

Create a migration service:

```java
package com.school.saas.module.document.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageMigrationService {

    @Value("${storage.local.base-path:C:/saas-school}")
    private String localBasePath;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    private final AmazonS3 s3Client;

    public void migrateLocalToS3() {
        Path localPath = Paths.get(localBasePath);

        if (!Files.exists(localPath)) {
            log.warn("Local storage path does not exist: {}", localBasePath);
            return;
        }

        log.info("Starting migration from {} to S3 bucket {}", localBasePath, bucketName);

        try (Stream<Path> paths = Files.walk(localPath)) {
            paths.filter(Files::isRegularFile)
                 .forEach(this::uploadFileToS3);
        } catch (IOException e) {
            log.error("Error during migration", e);
            throw new RuntimeException("Migration failed", e);
        }

        log.info("Migration completed successfully");
    }

    private void uploadFileToS3(Path filePath) {
        try {
            Path localPath = Paths.get(localBasePath);
            String relativePath = localPath.relativize(filePath).toString()
                    .replace("\\", "/");  // Convert Windows paths to S3 format

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(Files.size(filePath));

            // Detect content type
            String contentType = Files.probeContentType(filePath);
            if (contentType != null) {
                metadata.setContentType(contentType);
            }

            PutObjectRequest putRequest = new PutObjectRequest(
                    bucketName,
                    relativePath,
                    Files.newInputStream(filePath),
                    metadata
            );

            s3Client.putObject(putRequest);
            log.info("Uploaded: {}", relativePath);

        } catch (IOException e) {
            log.error("Failed to upload file: {}", filePath, e);
        }
    }

    public void verifyMigration() {
        Path localPath = Paths.get(localBasePath);

        try (Stream<Path> paths = Files.walk(localPath)) {
            long localFileCount = paths.filter(Files::isRegularFile).count();

            // Count S3 objects
            long s3FileCount = s3Client.listObjectsV2(bucketName)
                    .getObjectSummaries()
                    .size();

            log.info("Local files: {}, S3 files: {}", localFileCount, s3FileCount);

            if (localFileCount == s3FileCount) {
                log.info("Migration verification successful!");
            } else {
                log.warn("File count mismatch! Please review migration.");
            }

        } catch (IOException e) {
            log.error("Error during verification", e);
        }
    }
}
```

**Create Migration Endpoint (for admins):**

```java
@RestController
@RequestMapping("/api/admin/migration")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SUPER_ADMIN')")
public class MigrationController {

    private final StorageMigrationService migrationService;

    @PostMapping("/local-to-s3")
    public ResponseEntity<String> migrateToS3() {
        migrationService.migrateLocalToS3();
        return ResponseEntity.ok("Migration started");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyMigration() {
        migrationService.verifyMigration();
        return ResponseEntity.ok("Verification completed");
    }
}
```

---

## Testing the Migration

### 1. Test Upload with Local Storage

```bash
curl -X POST "http://localhost:8080/api/documents/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "entityType=STUDENT" \
  -F "entityId=123e4567-e89b-12d3-a456-426614174000" \
  -F "title=Test Document"
```

### 2. Switch to S3 Profile

```bash
SPRING_PROFILES_ACTIVE=s3 mvn spring-boot:run
```

### 3. Test Upload with S3

Use the same curl command - it should now upload to S3!

### 4. Verify Files in S3

```bash
aws s3 ls s3://your-bucket-name/school_123e4567/ --recursive
```

---

## Rollback Strategy

If you need to rollback from S3 to local storage:

1. **Download all files from S3:**
```bash
aws s3 sync s3://your-bucket-name/ C:/saas-school/
```

2. **Switch profile back to local:**
```bash
SPRING_PROFILES_ACTIVE=local
```

3. **Restart application**

---

## Cost Optimization

### S3 Storage Classes

For cost savings, use S3 lifecycle policies:

- **Standard**: Frequently accessed files (recent uploads)
- **Intelligent-Tiering**: Automatic cost optimization
- **Standard-IA**: Infrequently accessed files (old documents)
- **Glacier**: Archived documents (rarely accessed)

### Example Lifecycle Policy

```json
{
  "Rules": [
    {
      "Id": "TransitionOldFiles",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

---

## Monitoring and Alerts

### CloudWatch Metrics

Monitor these S3 metrics:
- `NumberOfObjects`: Total file count
- `BucketSizeBytes`: Total storage used
- `AllRequests`: API request count

### Cost Alerts

Set up AWS Budgets to alert when storage costs exceed thresholds.

---

## Alternative Cloud Storage Providers

The same architecture pattern can be used for:

### Google Cloud Storage

```java
@Service
@Profile("gcs")
public class GCSStorageServiceImpl implements StorageService {
    // Implementation using google-cloud-storage SDK
}
```

### Azure Blob Storage

```java
@Service
@Profile("azure")
public class AzureStorageServiceImpl implements StorageService {
    // Implementation using azure-storage-blob SDK
}
```

### MinIO (Self-Hosted S3-Compatible)

```java
@Service
@Profile("minio")
public class MinioStorageServiceImpl implements StorageService {
    // Implementation using MinIO Java SDK
}
```

---

## Troubleshooting

### Common Issues

**1. Access Denied Errors:**
- Check IAM permissions
- Verify AWS credentials
- Ensure bucket policy allows your operations

**2. Slow Uploads:**
- Check network bandwidth
- Consider using S3 Transfer Acceleration
- Implement multipart uploads for large files

**3. File Not Found:**
- Verify file path format (use forward slashes)
- Check bucket name and region
- Ensure file was uploaded successfully

**4. High Costs:**
- Review lifecycle policies
- Check for duplicate uploads
- Monitor data transfer costs

---

## Security Best Practices

1. **Use IAM Roles**: Instead of access keys when possible
2. **Enable Bucket Encryption**: Use SSE-S3 or SSE-KMS
3. **Block Public Access**: Ensure bucket is not publicly accessible
4. **Use Pre-Signed URLs**: For temporary file access
5. **Enable Versioning**: For data recovery
6. **Set up CloudTrail**: For audit logging
7. **Regular Backups**: Configure cross-region replication

---

## Support

For questions or issues:
- Check application logs
- Review AWS CloudWatch logs
- Contact system administrator
