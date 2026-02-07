# File Storage System

## Overview

The School SaaS Platform uses a flexible, interface-based file storage system that currently stores files locally on disk but can be easily migrated to cloud storage providers like AWS S3.

---

## Current Configuration

### Storage Location

**Default Path:** `C:\saas-school`

**Configurable via Environment Variable:**
```bash
STORAGE_PATH=C:/saas-school
```

### Folder Structure

Files are organized by school and entity type for easy management:

```
C:\saas-school\
├── school_{school-uuid}\
│   ├── STUDENT\
│   │   └── {student-uuid}\
│   │       ├── {random-uuid}.pdf
│   │       └── {random-uuid}.jpg
│   ├── TEACHER\
│   │   └── {teacher-uuid}\
│   │       ├── {random-uuid}.pdf
│   │       └── {random-uuid}.docx
│   ├── COURSE\
│   │   └── {course-uuid}\
│   │       └── {random-uuid}.pdf
│   ├── PAYMENT\
│   │   └── {payment-uuid}\
│   │       └── {random-uuid}.pdf
│   └── EVENT\
│       └── {event-uuid}\
│           └── {random-uuid}.jpg
```

### Example Structure

```
C:\saas-school\
├── school_123e4567-e89b-12d3-a456-426614174000\
│   ├── STUDENT\
│   │   ├── 456e7890-e89b-12d3-a456-426614174001\
│   │   │   ├── 789e0123-4567-89ab-cdef-0123456789ab.pdf  (Birth Certificate)
│   │   │   └── 012e3456-789a-bcde-f012-3456789abcde.jpg  (ID Card Photo)
│   │   └── 456e7890-e89b-12d3-a456-426614174002\
│   │       └── 345e6789-0abc-def1-2345-6789abcdef01.pdf  (Transcript)
│   ├── TEACHER\
│   │   └── 789e1234-e89b-12d3-a456-426614174003\
│   │       ├── 678e9012-3456-789a-bcde-f0123456789a.pdf  (Teaching Certificate)
│   │       └── 901e2345-6789-0abc-def1-23456789abcd.docx (CV)
│   └── COURSE\
│       └── 012e3456-e89b-12d3-a456-426614174004\
│           ├── 234e5678-90ab-cdef-0123-456789abcdef.pdf  (Syllabus)
│           └── 567e8901-2345-6789-abcd-ef0123456789.pptx (Lecture Slides)
```

---

## File Upload Flow

### 1. Client Uploads File

**Endpoint:** `POST /api/documents/upload`

**Request (multipart/form-data):**
```
file: [binary file data]
entityType: STUDENT
entityId: 456e7890-e89b-12d3-a456-426614174001
title: Birth Certificate
```

### 2. Server Processing

1. **Validate File:**
   - Check file size (max 10MB)
   - Verify file type (PDF, images, Office docs)
   - Ensure file is not empty

2. **Generate Unique Filename:**
   - Original: `birth_certificate.pdf`
   - Generated: `789e0123-4567-89ab-cdef-0123456789ab.pdf`

3. **Determine Storage Path:**
   ```
   school_123e4567.../STUDENT/456e7890.../789e0123...pdf
   ```

4. **Save to Disk:**
   - Create directories if needed
   - Copy file to final location
   - Return relative path

5. **Save Metadata to Database:**
   ```sql
   INSERT INTO documents (
     id, school_id, entity_type, entity_id,
     title, file_path, file_type, file_size,
     uploaded_by, uploaded_at
   ) VALUES (...)
   ```

### 3. Response

```json
{
  "id": "doc-uuid",
  "filePath": "school_123e4567.../STUDENT/456e7890.../789e0123...pdf",
  "fileUrl": "/api/documents/download?path=school_123e4567..."
}
```

---

## File Download Flow

### 1. Client Requests File

**Endpoint:** `GET /api/documents/download?path={filePath}`

**Example:**
```
GET /api/documents/download?path=school_123e4567/STUDENT/456e7890/789e0123.pdf
```

### 2. Server Processing

1. **Validate Access:**
   - Check user authentication
   - Verify user has permission to access file
   - Validate school_id matches user's school

2. **Resolve File Path:**
   ```
   Full path: C:\saas-school\school_123e4567\STUDENT\456e7890\789e0123.pdf
   ```

3. **Serve File:**
   - Read file from disk
   - Set appropriate Content-Type
   - Set Content-Disposition header
   - Stream file to client

---

## Supported File Types

### Documents
- PDF (`.pdf`) - `application/pdf`
- Word (`.doc`, `.docx`) - `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Excel (`.xls`, `.xlsx`) - `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

### Images
- JPEG (`.jpg`, `.jpeg`) - `image/jpeg`
- PNG (`.png`) - `image/png`
- GIF (`.gif`) - `image/gif`

### Size Limits
- Maximum file size: **10MB** (10,485,760 bytes)
- Configurable via `storage.max-file-size` property

---

## API Endpoints

### Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [file data]
entityType: STUDENT|TEACHER|COURSE|PAYMENT|EVENT
entityId: {uuid}
title: Document Title
```

### Download Document
```http
GET /api/documents/download?path={filePath}
Authorization: Bearer {token}
```

### Get Document Metadata
```http
GET /api/documents/{documentId}
Authorization: Bearer {token}
```

### Get Documents by Entity
```http
GET /api/documents/entity/{entityType}/{entityId}
Authorization: Bearer {token}
```

### Delete Document
```http
DELETE /api/documents/{documentId}
Authorization: Bearer {token}
```

### Get Storage Usage
```http
GET /api/documents/storage-used
Authorization: Bearer {token}
```

---

## Managing Storage

### Checking Storage Usage

Each school's storage usage is tracked and can be queried:

```bash
curl -X GET "http://localhost:8080/api/documents/storage-used" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Returns total bytes used by the school.

### Backing Up Files

#### Backup Single School
```bash
# Windows
xcopy /E /I "C:\saas-school\school_{uuid}" "D:\backups\school_{uuid}"

# Linux/Mac
cp -r /saas-school/school_{uuid} /backups/school_{uuid}
```

#### Backup All Files
```bash
# Windows
xcopy /E /I "C:\saas-school" "D:\backups\saas-school"

# Linux/Mac
cp -r /saas-school /backups/saas-school
```

### Restoring Files

```bash
# Windows
xcopy /E /I "D:\backups\school_{uuid}" "C:\saas-school\school_{uuid}"

# Linux/Mac
cp -r /backups/school_{uuid} /saas-school/school_{uuid}
```

### Cleaning Up Orphaned Files

Files may become orphaned if database records are deleted but files remain. To clean up:

```java
// TODO: Implement cleanup service
@Service
public class StorageCleanupService {
    public void removeOrphanedFiles() {
        // 1. Get all file paths from database
        // 2. List all files on disk
        // 3. Delete files not in database
    }
}
```

---

## Security Considerations

### Access Control

1. **Authentication Required:** All file operations require valid JWT token
2. **School Isolation:** Users can only access files from their own school
3. **Role-Based Access:**
   - SUPER_ADMIN: Access all files
   - SCHOOL_ADMIN: Access all school files
   - TEACHER: Access assigned class files
   - STUDENT: Access own files only
   - PARENT: Access linked student files

### File Validation

1. **File Type Checking:** Only allowed file types accepted
2. **File Size Limits:** Prevents disk space abuse
3. **Virus Scanning:** Should be implemented for production
4. **Filename Sanitization:** UUIDs prevent path traversal attacks

### Recommendations

1. **Use Antivirus:** Scan files before storage
2. **Encrypt at Rest:** Consider disk encryption
3. **Regular Backups:** Automated daily backups
4. **Access Logging:** Log all file access
5. **Retention Policy:** Define document retention rules

---

## Monitoring

### Disk Space Monitoring

Monitor available disk space on the storage drive:

```bash
# Windows
wmic logicaldisk get size,freespace,caption

# Linux/Mac
df -h /saas-school
```

### File Count Monitoring

```bash
# Windows PowerShell
(Get-ChildItem -Path "C:\saas-school" -Recurse -File | Measure-Object).Count

# Linux/Mac
find /saas-school -type f | wc -l
```

### Alerts

Set up alerts when:
- Disk space < 10% free
- File upload failures increase
- Storage usage exceeds school's plan limit

---

## Troubleshooting

### Issue: "Failed to upload file"

**Causes:**
1. Disk full
2. Permission denied
3. Invalid file type
4. File too large

**Solutions:**
1. Check disk space
2. Verify folder permissions
3. Check file type and size
4. Review error logs

### Issue: "File not found"

**Causes:**
1. File was deleted manually
2. Incorrect file path
3. Database out of sync

**Solutions:**
1. Check if file exists on disk
2. Verify database record
3. Run integrity check

### Issue: Slow uploads

**Causes:**
1. Disk I/O bottleneck
2. Network issues
3. Large file size

**Solutions:**
1. Use SSD for storage
2. Check network bandwidth
3. Implement upload chunking

---

## Migration Path

This local storage system is designed to be easily migrated to cloud storage:

### AWS S3
See `STORAGE_MIGRATION_GUIDE.md` for detailed instructions.

### Other Cloud Providers
- Google Cloud Storage
- Azure Blob Storage
- DigitalOcean Spaces
- MinIO (self-hosted)

The same folder structure will be maintained in cloud storage for consistency.

---

## Configuration Reference

### Environment Variables

```bash
# Storage location (required)
STORAGE_PATH=C:/saas-school

# Maximum file size in bytes (optional, default 10MB)
STORAGE_MAX_FILE_SIZE=10485760
```

### Application Properties

```yaml
storage:
  local:
    base-path: ${STORAGE_PATH:C:/saas-school}
  max-file-size: 10485760

spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB
      max-request-size: 10MB
```

---

## Best Practices

1. **Regular Backups:** Automate daily backups
2. **Monitor Disk Space:** Set up alerts
3. **Document Retention:** Define clear policies
4. **Access Logging:** Track all file operations
5. **Secure Storage:** Use encrypted drives
6. **Organize Files:** Maintain folder structure
7. **Plan for Growth:** Monitor storage trends
8. **Test Restores:** Verify backups work

---

## Support

For issues or questions:
- Check application logs: `logs/school-saas.log`
- Review API documentation: `API_DOCUMENTATION.md`
- Migration guide: `STORAGE_MIGRATION_GUIDE.md`
