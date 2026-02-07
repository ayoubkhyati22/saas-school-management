# Frontend Integration Guide

## Quick Start for Frontend Developers

This guide helps you integrate the file storage and avatar/document features into your frontend application.

---

## Base Configuration

### API Base URL
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Authentication
All requests require a JWT token in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## Common Frontend Patterns

### 1. Upload and Display Student Avatar

```javascript
// Upload avatar
const uploadStudentAvatar = async (studentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'STUDENT');
  formData.append('entityId', studentId);
  formData.append('title', 'Profile Avatar');

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Update student record with avatar URL
  await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatarUrl: result.data.filePath
    })
  });

  return result.data.filePath;
};

// Display avatar component (React example)
const StudentAvatar = ({ student }) => {
  const getAvatarUrl = () => {
    if (!student.avatarUrl) {
      return '/images/default-avatar.png';
    }
    return `${API_BASE_URL}/documents/download?path=${encodeURIComponent(student.avatarUrl)}`;
  };

  return (
    <img
      src={getAvatarUrl()}
      alt={`${student.firstName} ${student.lastName}`}
      className="w-20 h-20 rounded-full object-cover"
      onError={(e) => {
        e.target.src = '/images/default-avatar.png';
      }}
    />
  );
};
```

### 2. Upload and Manage Student Documents

```javascript
// Upload administrative document
const uploadStudentDocument = async (studentId, file, documentType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'STUDENT');
  formData.append('entityId', studentId);
  formData.append('title', file.name);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Get current student
  const studentResponse = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const studentData = await studentResponse.json();
  const student = studentData.data;

  // Parse existing documents
  const documents = student.administrativeDocuments
    ? JSON.parse(student.administrativeDocuments)
    : [];

  // Add new document
  documents.push({
    id: result.data.id,
    name: file.name,
    url: result.data.filePath,
    type: documentType,
    uploadedAt: new Date().toISOString(),
    size: result.data.fileSize
  });

  // Update student
  await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      administrativeDocuments: JSON.stringify(documents)
    })
  });

  return documents;
};

// Display documents list (React example)
const StudentDocuments = ({ student }) => {
  const documents = student.administrativeDocuments
    ? JSON.parse(student.administrativeDocuments)
    : [];

  const downloadDocument = async (doc) => {
    const response = await fetch(
      `${API_BASE_URL}/documents/download?path=${encodeURIComponent(doc.url)}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="document-list">
      <h3>Administrative Documents</h3>
      {documents.length === 0 ? (
        <p>No documents uploaded</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <span>{doc.name}</span>
              <span>{(doc.size / 1024).toFixed(2)} KB</span>
              <button onClick={() => downloadDocument(doc)}>
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 3. Upload Teacher Documents

```javascript
// Upload teacher certificate
const uploadTeacherCertificate = async (teacherId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'TEACHER');
  formData.append('entityId', teacherId);
  formData.append('title', file.name);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Update teacher's administrative documents
  const teacherResponse = await fetch(`${API_BASE_URL}/teachers/${teacherId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const teacherData = await teacherResponse.json();
  const teacher = teacherData.data;

  const documents = teacher.administrativeDocuments
    ? JSON.parse(teacher.administrativeDocuments)
    : [];

  documents.push({
    id: result.data.id,
    name: file.name,
    url: result.data.filePath,
    type: 'CERTIFICATE',
    uploadedAt: new Date().toISOString(),
    size: result.data.fileSize
  });

  await fetch(`${API_BASE_URL}/teachers/${teacherId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      administrativeDocuments: JSON.stringify(documents)
    })
  });
};
```

### 4. Upload Course Materials

```javascript
// Upload course material
const uploadCourseMaterial = async (courseId, file, materialType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'COURSE');
  formData.append('entityId', courseId);
  formData.append('title', file.name);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Update course documents
  const courseResponse = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const courseData = await courseResponse.json();
  const course = courseData.data;

  const documents = course.documents
    ? JSON.parse(course.documents)
    : [];

  documents.push({
    id: result.data.id,
    name: file.name,
    url: result.data.filePath,
    type: materialType, // SYLLABUS, LECTURE_NOTES, ASSIGNMENT, etc.
    uploadedAt: new Date().toISOString(),
    size: result.data.fileSize
  });

  await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documents: JSON.stringify(documents)
    })
  });

  return documents;
};

// Course materials component (React example)
const CourseMaterials = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setCourse(data.data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadCourseMaterial(courseId, file, 'LECTURE_NOTES');
      await fetchCourse();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const documents = course?.documents
    ? JSON.parse(course.documents)
    : [];

  return (
    <div className="course-materials">
      <h3>Course Materials</h3>

      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
        accept=".pdf,.doc,.docx,.ppt,.pptx"
      />

      {uploading && <p>Uploading...</p>}

      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <a
              href={`${API_BASE_URL}/documents/download?path=${encodeURIComponent(doc.url)}`}
              download={doc.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.name}
            </a>
            <span>{doc.type}</span>
            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### 5. Upload Event Image

```javascript
// Upload event banner
const uploadEventImage = async (eventId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'EVENT');
  formData.append('entityId', eventId);
  formData.append('title', 'Event Banner');

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Update event with image URL
  await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrl: result.data.filePath
    })
  });

  return result.data.filePath;
};

// Event card component (React example)
const EventCard = ({ event }) => {
  const getImageUrl = () => {
    if (!event.imageUrl) {
      return '/images/default-event.jpg';
    }
    return `${API_BASE_URL}/documents/download?path=${encodeURIComponent(event.imageUrl)}`;
  };

  return (
    <div className="event-card">
      <img
        src={getImageUrl()}
        alt={event.title}
        className="event-image"
        onError={(e) => {
          e.target.src = '/images/default-event.jpg';
        }}
      />
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <time>{new Date(event.eventDate).toLocaleDateString()}</time>
    </div>
  );
};
```

### 6. Upload School Logo

```javascript
// Upload school logo
const uploadSchoolLogo = async (schoolId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'SCHOOL');
  formData.append('entityId', schoolId);
  formData.append('title', 'School Logo');

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  // Update school with logo URL
  await fetch(`${API_BASE_URL}/schools/${schoolId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      logoUrl: result.data.filePath
    })
  });

  return result.data.filePath;
};

// School header component (React example)
const SchoolHeader = ({ school }) => {
  const getLogoUrl = () => {
    if (!school.logoUrl) {
      return '/images/default-logo.png';
    }
    return `${API_BASE_URL}/documents/download?path=${encodeURIComponent(school.logoUrl)}`;
  };

  return (
    <header className="school-header">
      <img
        src={getLogoUrl()}
        alt={school.name}
        className="school-logo"
      />
      <h1>{school.name}</h1>
    </header>
  );
};
```

---

## Reusable Components

### File Upload Component (React)

```javascript
const FileUploader = ({
  entityType,
  entityId,
  onUploadComplete,
  accept = '*',
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);
      formData.append('title', file.name);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress((e.loaded / e.total) * 100);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const result = JSON.parse(xhr.responseText);
          onUploadComplete(result.data);
          setUploading(false);
          setProgress(100);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed');
        setUploading(false);
      });

      xhr.open('POST', `${API_BASE_URL}/documents/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
        accept={accept}
      />

      {uploading && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

// Usage:
<FileUploader
  entityType="STUDENT"
  entityId={student.id}
  accept="image/*"
  onUploadComplete={(fileData) => {
    console.log('Upload complete:', fileData);
    // Update student avatar...
  }}
/>
```

### Image Preview Component (React)

```javascript
const ImagePreview = ({ src, alt, fallback = '/images/default.png' }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src);
    setLoading(true);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setImageSrc(fallback);
    setLoading(false);
  };

  return (
    <div className="image-preview">
      {loading && <div className="spinner">Loading...</div>}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};

// Usage:
<ImagePreview
  src={`${API_BASE_URL}/documents/download?path=${student.avatarUrl}`}
  alt={student.firstName}
  fallback="/images/default-avatar.png"
/>
```

---

## Form Validation

### File Type Validation

```javascript
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
    );
  }
};

// Usage:
try {
  validateFileType(file, ALLOWED_IMAGE_TYPES);
  // Proceed with upload...
} catch (error) {
  alert(error.message);
}
```

### File Size Validation

```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }
};
```

---

## Error Handling

```javascript
const handleUploadError = (error, response) => {
  if (response?.status === 401) {
    return 'Authentication required. Please log in again.';
  }

  if (response?.status === 403) {
    return 'You do not have permission to upload files.';
  }

  if (response?.status === 413) {
    return 'File size too large. Maximum size is 10MB.';
  }

  if (response?.status === 415) {
    return 'File type not supported.';
  }

  if (response?.status === 507) {
    return 'Storage limit reached. Please contact administrator.';
  }

  return error.message || 'Upload failed. Please try again.';
};

// Usage:
try {
  await uploadFile(file);
} catch (error) {
  const message = handleUploadError(error, error.response);
  alert(message);
}
```

---

## Storage Usage Display

```javascript
const StorageUsage = ({ schoolId }) => {
  const [usage, setUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorageUsage();
  }, []);

  const fetchStorageUsage = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/documents/storage-used`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();
      setUsage(data.data);
    } catch (error) {
      console.error('Failed to fetch storage usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="storage-usage">
      <h3>Storage Usage</h3>
      <p>{formatBytes(usage)} used</p>
    </div>
  );
};
```

---

## Complete Example: Student Profile Page

```javascript
const StudentProfile = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    const response = await fetch(
      `${API_BASE_URL}/students/${studentId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await response.json();
    setStudent(data.data);
    setLoading(false);
  };

  const handleAvatarUpload = async (file) => {
    const avatarUrl = await uploadStudentAvatar(studentId, file);
    setStudent({ ...student, avatarUrl });
  };

  const handleDocumentUpload = async (file, docType) => {
    const documents = await uploadStudentDocument(studentId, file, docType);
    setStudent({
      ...student,
      administrativeDocuments: JSON.stringify(documents)
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  const documents = student.administrativeDocuments
    ? JSON.parse(student.administrativeDocuments)
    : [];

  return (
    <div className="student-profile">
      <div className="profile-header">
        <ImagePreview
          src={`${API_BASE_URL}/documents/download?path=${student.avatarUrl}`}
          alt={`${student.firstName} ${student.lastName}`}
          fallback="/images/default-avatar.png"
        />

        <div className="profile-info">
          <h2>{student.firstName} {student.lastName}</h2>
          <p>Registration: {student.registrationNumber}</p>
          <p>Class: {student.classRoomName}</p>
        </div>

        <FileUploader
          entityType="STUDENT"
          entityId={studentId}
          accept="image/*"
          onUploadComplete={(data) => {
            setStudent({ ...student, avatarUrl: data.filePath });
          }}
        />
      </div>

      <div className="documents-section">
        <h3>Administrative Documents</h3>

        <FileUploader
          entityType="STUDENT"
          entityId={studentId}
          accept=".pdf,.doc,.docx"
          onUploadComplete={() => fetchStudent()}
        />

        <ul className="document-list">
          {documents.map((doc) => (
            <li key={doc.id}>
              <span>{doc.name}</span>
              <span>{doc.type}</span>
              <button
                onClick={() => downloadDocument(doc)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

---

## TypeScript Types

```typescript
interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  size: number;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  administrativeDocuments?: string; // JSON string
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  administrativeDocuments?: string; // JSON string
}

interface Course {
  id: string;
  subject: string;
  documents?: string; // JSON string
}

interface Event {
  id: string;
  title: string;
  imageUrl?: string;
}

interface School {
  id: string;
  name: string;
  logoUrl?: string;
  avatarUrl?: string;
}
```

---

## Next Steps

1. **Set up your API client** with base URL and authentication
2. **Test file uploads** with Postman or your frontend
3. **Implement avatar displays** for students and teachers
4. **Add document management** UIs
5. **Handle errors gracefully**
6. **Add loading states and progress bars**
7. **Test with different file types and sizes**

---

## Support

For API questions, refer to:
- **API_DOCUMENTATION.md** - Complete API reference
- **STORAGE_README.md** - Storage system documentation
- **Swagger UI** - http://localhost:8080/swagger-ui.html
