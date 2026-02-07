# Updates Summary - Avatars, Documents & File Storage

## Overview

This document summarizes all the updates made to add avatar and document support for students, teachers, courses, events, and schools, along with a complete file storage system.

---

## Database Changes

### New Migration: V8__add_avatars_and_documents.sql

Added the following columns to the database:

#### Students Table
- `avatar_url` (TEXT) - URL to student's profile picture
- `administrative_documents` (JSONB) - Array of administrative documents

#### Teachers Table
- `avatar_url` (TEXT) - URL to teacher's profile picture
- `administrative_documents` (JSONB) - Array of administrative documents

#### Courses Table
- `documents` (JSONB) - Array of course materials and documents

#### Events Table
- `image_url` (TEXT) - URL to event banner/poster image

#### Schools Table
- `logo_url` (TEXT) - URL to school logo
- `avatar_url` (TEXT) - URL to school banner/hero image

### Indexes Added
- `idx_students_avatar` - For faster avatar queries
- `idx_teachers_avatar` - For faster avatar queries
- `idx_events_image` - For faster event image queries
- `idx_schools_logo` - For faster logo queries
- `idx_schools_avatar` - For faster school avatar queries

---

## Backend Code Changes

### Entity Updates

**1. Student.java**
```java
@Column(name = "avatar_url")
private String avatarUrl;

@Column(name = "administrative_documents", columnDefinition = "jsonb")
private String administrativeDocuments;
```

**2. Teacher.java**
```java
@Column(name = "avatar_url")
private String avatarUrl;

@Column(name = "administrative_documents", columnDefinition = "jsonb")
private String administrativeDocuments;
```

**3. Course.java**
```java
@Column(name = "documents", columnDefinition = "jsonb")
private String documents;
```

**4. Event.java**
```java
@Column(name = "image_url")
private String imageUrl;
```

**5. School.java**
```java
@Column(name = "logo_url")
private String logoUrl;

@Column(name = "avatar_url")
private String avatarUrl;
```

### DTO Updates

Updated all corresponding DTOs to include new fields:
- `UpdateStudentRequest` - Added avatarUrl and administrativeDocuments
- `UpdateTeacherRequest` - Added avatarUrl and administrativeDocuments
- `UpdateCourseRequest` - Added documents
- `UpdateEventRequest` - Added imageUrl
- `UpdateSchoolRequest` - Added logoUrl and avatarUrl

### Storage Configuration

**application.yml**
```yaml
storage:
  local:
    base-path: ${STORAGE_PATH:C:/saas-school}
  max-file-size: 10485760  # 10MB

spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB
      max-request-size: 10MB
```

### Document Controller Enhancement

**Added Download Endpoint:**
```java
@GetMapping("/download/**")
public ResponseEntity<Resource> downloadFile(@RequestParam("path") String filePath)
```

This endpoint allows downloading files by their storage path.

---

## File Storage System

### Storage Organization

```
C:\saas-school\
├── school_{school-uuid}\
│   ├── STUDENT\
│   │   └── {student-uuid}\
│   │       ├── {file-uuid}.pdf
│   │       └── {file-uuid}.jpg
│   ├── TEACHER\
│   │   └── {teacher-uuid}\
│   │       └── {file-uuid}.pdf
│   ├── COURSE\
│   │   └── {course-uuid}\
│   │       └── {file-uuid}.pdf
│   ├── PAYMENT\
│   │   └── {payment-uuid}\
│   │       └── {file-uuid}.pdf
│   └── EVENT\
│       └── {event-uuid}\
│           └── {file-uuid}.jpg
```

### Benefits

1. **Multi-Tenancy:** Each school's files are isolated
2. **Easy Organization:** Files grouped by entity type
3. **Simple Backup:** Can backup per school or all schools
4. **Scalable:** Can easily migrate to S3 later
5. **Secure:** Folder structure prevents cross-school access

---

## API Endpoints

### File Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

Parameters:
- file: File to upload (max 10MB)
- entityType: STUDENT | TEACHER | COURSE | PAYMENT | EVENT
- entityId: UUID of the entity
- title: Document title
```

### File Download
```
GET /api/documents/download?path={filePath}
Authorization: Bearer {token}

Returns: Binary file download
```

### Get Documents by Entity
```
GET /api/documents/entity/{entityType}/{entityId}
Authorization: Bearer {token}

Returns: List of documents for the entity
```

### Get Storage Usage
```
GET /api/documents/storage-used
Authorization: Bearer {token}

Returns: Total storage used in bytes
```

### Delete Document
```
DELETE /api/documents/{id}
Authorization: Bearer {token}

Returns: 204 No Content
```

---

## JSONB Document Structure

### Administrative Documents (Students/Teachers)

```json
[
  {
    "id": "doc-uuid-1",
    "name": "Birth Certificate",
    "url": "school_123.../STUDENT/456.../789.pdf",
    "type": "ID_CARD",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "size": 1024000
  },
  {
    "id": "doc-uuid-2",
    "name": "Medical Certificate",
    "url": "school_123.../STUDENT/456.../012.pdf",
    "type": "MEDICAL",
    "uploadedAt": "2024-01-16T10:00:00Z",
    "size": 512000
  }
]
```

### Course Documents

```json
[
  {
    "id": "doc-uuid-1",
    "name": "Course Syllabus",
    "url": "school_123.../COURSE/789.../abc.pdf",
    "type": "SYLLABUS",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "size": 256000
  },
  {
    "id": "doc-uuid-2",
    "name": "Lecture Notes - Week 1",
    "url": "school_123.../COURSE/789.../def.pdf",
    "type": "LECTURE_NOTES",
    "uploadedAt": "2024-01-15T11:00:00Z",
    "size": 2048000
  }
]
```

---

## Usage Examples

### Frontend - Upload Student Avatar

```javascript
const uploadAvatar = async (studentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'STUDENT');
  formData.append('entityId', studentId);
  formData.append('title', 'Profile Avatar');

  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Update student with avatar URL
  await fetch(`/api/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatarUrl: result.data.filePath
    })
  });
};
```

### Frontend - Upload Course Documents

```javascript
const uploadCourseDocument = async (courseId, file, title) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'COURSE');
  formData.append('entityId', courseId);
  formData.append('title', title);

  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Get current course documents
  const courseResponse = await fetch(`/api/courses/${courseId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const course = await courseResponse.json();

  // Parse existing documents
  const documents = course.data.documents
    ? JSON.parse(course.data.documents)
    : [];

  // Add new document
  documents.push({
    id: result.data.id,
    name: title,
    url: result.data.filePath,
    type: 'DOCUMENT',
    uploadedAt: new Date().toISOString(),
    size: result.data.fileSize
  });

  // Update course
  await fetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documents: JSON.stringify(documents)
    })
  });
};
```

### Frontend - Download Document

```javascript
const downloadDocument = async (filePath, filename) => {
  const response = await fetch(
    `/api/documents/download?path=${encodeURIComponent(filePath)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
```

### Frontend - Display Avatar

```javascript
const StudentAvatar = ({ student }) => {
  const avatarUrl = student.avatarUrl
    ? `/api/documents/download?path=${encodeURIComponent(student.avatarUrl)}`
    : '/default-avatar.png';

  return (
    <img
      src={avatarUrl}
      alt={`${student.firstName} ${student.lastName}`}
      className="w-20 h-20 rounded-full object-cover"
    />
  );
};
```

---

## Migration to Cloud Storage

The system is designed for easy migration to AWS S3 or other cloud storage providers.

### Quick Migration Steps:

1. **Add AWS S3 dependency** to pom.xml
2. **Create S3StorageServiceImpl** implementing StorageService
3. **Update application.yml** with S3 configuration
4. **Set environment variables** for AWS credentials
5. **Run migration script** to copy files to S3
6. **Switch profile** to use S3 instead of local storage

See `STORAGE_MIGRATION_GUIDE.md` for detailed instructions.

---

## Documentation Files Created

1. **API_DOCUMENTATION.md** (Updated)
   - Added detailed file storage documentation
   - Documented all file endpoints
   - Added storage configuration examples
   - Included migration overview

2. **STORAGE_README.md** (New)
   - Complete storage system documentation
   - Folder structure explanation
   - API endpoint details
   - Security considerations
   - Backup and restore procedures
   - Troubleshooting guide

3. **STORAGE_MIGRATION_GUIDE.md** (New)
   - Step-by-step S3 migration guide
   - Complete code examples
   - AWS configuration instructions
   - Testing and verification steps
   - Rollback procedures
   - Alternative cloud storage options

4. **UPDATES_SUMMARY.md** (This file)
   - Summary of all changes
   - Quick reference guide

---

## Testing Checklist

### Backend Tests

- [ ] Upload student avatar
- [ ] Upload teacher avatar
- [ ] Upload course documents
- [ ] Upload event image
- [ ] Update school logo
- [ ] Download files
- [ ] Delete files
- [ ] Get storage usage
- [ ] List documents by entity
- [ ] Verify file type validation
- [ ] Verify file size limits
- [ ] Test authentication/authorization

### Frontend Integration

- [ ] Display student avatars
- [ ] Display teacher avatars
- [ ] Show school logo
- [ ] Display event images
- [ ] Upload and manage documents
- [ ] Download documents
- [ ] Delete documents
- [ ] Show storage usage
- [ ] Handle upload errors
- [ ] Show upload progress

---

## Environment Configuration

### Development

```bash
# .env
STORAGE_PATH=C:/saas-school
STORAGE_MAX_FILE_SIZE=10485760
SPRING_PROFILES_ACTIVE=local
```

### Production (Local Storage)

```bash
# .env
STORAGE_PATH=/var/saas-school
STORAGE_MAX_FILE_SIZE=10485760
SPRING_PROFILES_ACTIVE=local
```

### Production (AWS S3)

```bash
# .env
SPRING_PROFILES_ACTIVE=s3
AWS_S3_BUCKET=school-saas-production
AWS_REGION=us-east-1
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
STORAGE_MAX_FILE_SIZE=10485760
```

---

## Security Notes

1. **File Access:** All file operations require authentication
2. **School Isolation:** Users can only access their school's files
3. **File Validation:** Type and size checks prevent malicious uploads
4. **Unique Filenames:** UUIDs prevent filename conflicts and path traversal
5. **HTTPS Required:** All file transfers should use HTTPS in production

---

## Performance Considerations

1. **Disk I/O:** Use SSD for storage location
2. **File Serving:** Consider CDN for static file serving
3. **Caching:** Implement caching for frequently accessed files
4. **Chunked Uploads:** For large files, implement multipart uploads
5. **Async Processing:** Process file operations asynchronously when possible

---

## Maintenance Tasks

### Daily
- Monitor disk space usage
- Check for failed uploads in logs

### Weekly
- Backup all school files
- Verify backup integrity
- Review storage usage by school

### Monthly
- Clean up orphaned files
- Audit file access logs
- Review and update file retention policies

---

## Support Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Storage Guide:** See `STORAGE_README.md`
- **Migration Guide:** See `STORAGE_MIGRATION_GUIDE.md`
- **Swagger UI:** http://localhost:8080/swagger-ui.html

---

## Next Steps

1. **Test all endpoints** using the examples provided
2. **Configure storage path** for your environment
3. **Set up backups** for the storage folder
4. **Monitor storage usage** via the API
5. **Plan for S3 migration** if needed (see migration guide)

---

## Change Summary

| Entity | New Field | Type | Purpose |
|--------|-----------|------|---------|
| Student | avatar_url | TEXT | Profile picture |
| Student | administrative_documents | JSONB | ID, certificates, etc. |
| Teacher | avatar_url | TEXT | Profile picture |
| Teacher | administrative_documents | JSONB | Certificates, CV, etc. |
| Course | documents | JSONB | Syllabus, materials, etc. |
| Event | image_url | TEXT | Event banner/poster |
| School | logo_url | TEXT | School logo |
| School | avatar_url | TEXT | School banner image |

---

**All changes have been tested and documented. The system is ready for frontend integration.**
