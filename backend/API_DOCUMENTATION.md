# API Documentation - School SaaS Platform

## Base URL
```
http://localhost:8080/api
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [School Management APIs](#school-management-apis)
3. [User Management APIs](#user-management-apis)
4. [Student Management APIs](#student-management-apis)
5. [Teacher Management APIs](#teacher-management-apis)
6. [Parent Management APIs](#parent-management-apis)
7. [Classroom Management APIs](#classroom-management-apis)
8. [Course Management APIs](#course-management-apis)
9. [Event Management APIs](#event-management-apis)
10. [Absence Management APIs](#absence-management-apis)
11. [Payment Management APIs](#payment-management-apis)
12. [Notification Management APIs](#notification-management-apis)
13. [Issue Management APIs](#issue-management-apis)
14. [Document Management APIs](#document-management-apis)
15. [Subscription Management APIs](#subscription-management-apis)
16. [Dashboard APIs](#dashboard-apis)
17. [Chat Management APIs](#chat-management-apis)
18. [Audit Log APIs](#audit-log-apis)

---

## Authentication APIs

### 1. Register User
**Endpoint:** `POST /auth/register`
**Authentication:** Not required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "schoolId": "uuid",
  "role": "SCHOOL_ADMIN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "SCHOOL_ADMIN"
  }
}
```

### 2. Login
**Endpoint:** `POST /auth/login`
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "SCHOOL_ADMIN",
      "schoolId": "uuid"
    }
  }
}
```

### 3. Refresh Token
**Endpoint:** `POST /auth/refresh`
**Authentication:** Required (Refresh Token)

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600
  }
}
```

---

## School Management APIs

### 1. Create School
**Endpoint:** `POST /schools`
**Authentication:** Required (SUPER_ADMIN)

**Request Body:**
```json
{
  "name": "Springfield High School",
  "address": "123 Main St, Springfield",
  "email": "contact@springfield.edu",
  "phone": "+1234567890",
  "logoUrl": "https://example.com/logo.png",
  "avatarUrl": "https://example.com/avatar.png"
}
```

**Response:**
```json
{
  "success": true,
  "message": "School created successfully",
  "data": {
    "id": "uuid",
    "name": "Springfield High School",
    "address": "123 Main St, Springfield",
    "email": "contact@springfield.edu",
    "phone": "+1234567890",
    "active": true,
    "registrationDate": "2024-01-15",
    "logoUrl": "https://example.com/logo.png",
    "avatarUrl": "https://example.com/avatar.png"
  }
}
```

### 2. Get All Schools
**Endpoint:** `GET /schools?page=0&size=10&sort=name,asc`
**Authentication:** Required (SUPER_ADMIN)

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `sort` (optional): Sort field and direction (e.g., name,asc)
- `search` (optional): Search query

**Response:**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "name": "Springfield High School",
        "email": "contact@springfield.edu",
        "phone": "+1234567890",
        "active": true,
        "registrationDate": "2024-01-15",
        "logoUrl": "https://example.com/logo.png",
        "avatarUrl": "https://example.com/avatar.png"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Get School by ID
**Endpoint:** `GET /schools/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "School retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Springfield High School",
    "address": "123 Main St, Springfield",
    "email": "contact@springfield.edu",
    "phone": "+1234567890",
    "active": true,
    "registrationDate": "2024-01-15",
    "activeSubscription": {
      "id": "uuid",
      "planName": "Premium",
      "status": "ACTIVE",
      "startDate": "2024-01-15",
      "endDate": "2025-01-15"
    },
    "totalStudents": 150,
    "totalTeachers": 20,
    "logoUrl": "https://example.com/logo.png",
    "avatarUrl": "https://example.com/avatar.png"
  }
}
```

### 4. Update School
**Endpoint:** `PUT /schools/{id}`
**Authentication:** Required (SUPER_ADMIN or SCHOOL_ADMIN)

**Request Body:**
```json
{
  "name": "Springfield High School Updated",
  "address": "456 Oak Ave, Springfield",
  "email": "info@springfield.edu",
  "phone": "+1234567891",
  "logoUrl": "https://example.com/new-logo.png",
  "avatarUrl": "https://example.com/new-avatar.png"
}
```

**Response:**
```json
{
  "success": true,
  "message": "School updated successfully",
  "data": {
    "id": "uuid",
    "name": "Springfield High School Updated",
    "address": "456 Oak Ave, Springfield",
    "email": "info@springfield.edu",
    "phone": "+1234567891",
    "active": true,
    "registrationDate": "2024-01-15",
    "logoUrl": "https://example.com/new-logo.png",
    "avatarUrl": "https://example.com/new-avatar.png"
  }
}
```

### 5. Delete School
**Endpoint:** `DELETE /schools/{id}`
**Authentication:** Required (SUPER_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "School deleted successfully",
  "data": null
}
```

---

## User Management APIs

### 1. Get Current User
**Endpoint:** `GET /users/me`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "SCHOOL_ADMIN",
    "enabled": true,
    "lastLoginAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Update User Profile
**Endpoint:** `PUT /users/me`
**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "SCHOOL_ADMIN"
  }
}
```

### 3. Change Password
**Endpoint:** `PUT /users/me/password`
**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### 4. Get All Users
**Endpoint:** `GET /users?page=0&size=10`
**Authentication:** Required (SCHOOL_ADMIN or SUPER_ADMIN)

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `role` (optional): Filter by role

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "TEACHER",
        "enabled": true
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

---

## Student Management APIs

### 1. Create Student
**Endpoint:** `POST /students`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phoneNumber": "+1234567890",
  "classRoomId": "uuid",
  "registrationNumber": "STU2024001",
  "birthDate": "2010-05-15",
  "gender": "FEMALE",
  "enrollmentDate": "2024-01-15",
  "address": "789 Elm St, Springfield",
  "avatarUrl": "https://example.com/alice-avatar.png",
  "administrativeDocuments": "[{\"id\":\"doc1\",\"name\":\"Birth Certificate\",\"url\":\"https://example.com/doc1.pdf\",\"type\":\"ID_CARD\",\"uploadedAt\":\"2024-01-15T10:00:00Z\",\"size\":1024000}]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "schoolId": "uuid",
    "classRoomId": "uuid",
    "classRoomName": "Grade 10-A",
    "registrationNumber": "STU2024001",
    "birthDate": "2010-05-15",
    "gender": "FEMALE",
    "enrollmentDate": "2024-01-15",
    "status": "ACTIVE",
    "address": "789 Elm St, Springfield",
    "avatarUrl": "https://example.com/alice-avatar.png",
    "administrativeDocuments": "[{\"id\":\"doc1\",\"name\":\"Birth Certificate\",\"url\":\"https://example.com/doc1.pdf\",\"type\":\"ID_CARD\",\"uploadedAt\":\"2024-01-15T10:00:00Z\",\"size\":1024000}]",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Students
**Endpoint:** `GET /students?page=0&size=10&status=ACTIVE`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `status` (optional): Filter by status (ACTIVE, INACTIVE, GRADUATED, etc.)
- `classRoomId` (optional): Filter by classroom

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "userId": "uuid",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice.johnson@example.com",
        "schoolId": "uuid",
        "classRoomId": "uuid",
        "classRoomName": "Grade 10-A",
        "registrationNumber": "STU2024001",
        "birthDate": "2010-05-15",
        "gender": "FEMALE",
        "enrollmentDate": "2024-01-15",
        "status": "ACTIVE",
        "address": "789 Elm St, Springfield",
        "avatarUrl": "https://example.com/alice-avatar.png",
        "administrativeDocuments": "[...]",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Get Student by ID
**Endpoint:** `GET /students/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phoneNumber": "+1234567890",
    "schoolId": "uuid",
    "schoolName": "Springfield High School",
    "classRoomId": "uuid",
    "classRoomName": "Grade 10-A",
    "classRoomLevel": "10",
    "classRoomSection": "A",
    "registrationNumber": "STU2024001",
    "birthDate": "2010-05-15",
    "gender": "FEMALE",
    "enrollmentDate": "2024-01-15",
    "status": "ACTIVE",
    "address": "789 Elm St, Springfield",
    "avatarUrl": "https://example.com/alice-avatar.png",
    "administrativeDocuments": "[...]",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Update Student
**Endpoint:** `PUT /students/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "phoneNumber": "+1234567891",
  "classRoomId": "uuid",
  "birthDate": "2010-05-15",
  "gender": "FEMALE",
  "status": "ACTIVE",
  "address": "789 Elm St, Springfield",
  "avatarUrl": "https://example.com/new-avatar.png",
  "administrativeDocuments": "[{\"id\":\"doc2\",\"name\":\"Updated Document\",\"url\":\"https://example.com/doc2.pdf\",\"type\":\"CERTIFICATE\",\"uploadedAt\":\"2024-01-16T10:00:00Z\",\"size\":2048000}]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": "uuid",
    "firstName": "Alice",
    "lastName": "Johnson",
    "avatarUrl": "https://example.com/new-avatar.png",
    "administrativeDocuments": "[...]"
  }
}
```

### 5. Delete Student
**Endpoint:** `DELETE /students/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": null
}
```

### 6. Get Student Statistics
**Endpoint:** `GET /students/statistics`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Student statistics retrieved successfully",
  "data": {
    "totalStudents": 150,
    "activeStudents": 140,
    "inactiveStudents": 5,
    "graduatedStudents": 5,
    "byGender": {
      "MALE": 75,
      "FEMALE": 73,
      "OTHER": 2
    },
    "byClassRoom": [
      {
        "classRoomName": "Grade 10-A",
        "count": 30
      }
    ]
  }
}
```

---

## Teacher Management APIs

### 1. Create Teacher
**Endpoint:** `POST /teachers`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "firstName": "Robert",
  "lastName": "Smith",
  "email": "robert.smith@example.com",
  "phoneNumber": "+1234567890",
  "speciality": "Mathematics",
  "hireDate": "2023-08-01",
  "employeeNumber": "EMP2023001",
  "salary": 50000.00,
  "avatarUrl": "https://example.com/robert-avatar.png",
  "administrativeDocuments": "[{\"id\":\"doc1\",\"name\":\"Teaching Certificate\",\"url\":\"https://example.com/cert1.pdf\",\"type\":\"CERTIFICATE\",\"uploadedAt\":\"2024-01-15T10:00:00Z\",\"size\":512000}]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Robert",
    "lastName": "Smith",
    "email": "robert.smith@example.com",
    "schoolId": "uuid",
    "speciality": "Mathematics",
    "hireDate": "2023-08-01",
    "employeeNumber": "EMP2023001",
    "status": "ACTIVE",
    "salary": 50000.00,
    "avatarUrl": "https://example.com/robert-avatar.png",
    "administrativeDocuments": "[...]",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Teachers
**Endpoint:** `GET /teachers?page=0&size=10&status=ACTIVE`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `status` (optional): Filter by status
- `speciality` (optional): Filter by speciality

**Response:**
```json
{
  "success": true,
  "message": "Teachers retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "userId": "uuid",
        "firstName": "Robert",
        "lastName": "Smith",
        "email": "robert.smith@example.com",
        "schoolId": "uuid",
        "speciality": "Mathematics",
        "hireDate": "2023-08-01",
        "employeeNumber": "EMP2023001",
        "status": "ACTIVE",
        "salary": 50000.00,
        "avatarUrl": "https://example.com/robert-avatar.png",
        "administrativeDocuments": "[...]",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Get Teacher by ID
**Endpoint:** `GET /teachers/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Teacher retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Robert",
    "lastName": "Smith",
    "email": "robert.smith@example.com",
    "phoneNumber": "+1234567890",
    "schoolId": "uuid",
    "schoolName": "Springfield High School",
    "speciality": "Mathematics",
    "hireDate": "2023-08-01",
    "employeeNumber": "EMP2023001",
    "status": "ACTIVE",
    "salary": 50000.00,
    "avatarUrl": "https://example.com/robert-avatar.png",
    "administrativeDocuments": "[...]",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Update Teacher
**Endpoint:** `PUT /teachers/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "firstName": "Robert",
  "lastName": "Smith",
  "phoneNumber": "+1234567891",
  "speciality": "Advanced Mathematics",
  "status": "ACTIVE",
  "salary": 55000.00,
  "avatarUrl": "https://example.com/new-robert-avatar.png",
  "administrativeDocuments": "[{\"id\":\"doc2\",\"name\":\"Updated Certificate\",\"url\":\"https://example.com/cert2.pdf\",\"type\":\"CERTIFICATE\",\"uploadedAt\":\"2024-01-16T10:00:00Z\",\"size\":768000}]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher updated successfully",
  "data": {
    "id": "uuid",
    "firstName": "Robert",
    "lastName": "Smith",
    "speciality": "Advanced Mathematics",
    "salary": 55000.00,
    "avatarUrl": "https://example.com/new-robert-avatar.png",
    "administrativeDocuments": "[...]"
  }
}
```

### 5. Delete Teacher
**Endpoint:** `DELETE /teachers/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Teacher deleted successfully",
  "data": null
}
```

### 6. Get Teacher Statistics
**Endpoint:** `GET /teachers/statistics`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Teacher statistics retrieved successfully",
  "data": {
    "totalTeachers": 20,
    "activeTeachers": 18,
    "onLeaveTeachers": 2,
    "bySpeciality": [
      {
        "speciality": "Mathematics",
        "count": 5
      },
      {
        "speciality": "Science",
        "count": 4
      }
    ]
  }
}
```

---

## Parent Management APIs

### 1. Create Parent
**Endpoint:** `POST /parents`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "firstName": "Michael",
  "lastName": "Johnson",
  "email": "michael.johnson@example.com",
  "phoneNumber": "+1234567890",
  "occupation": "Engineer",
  "address": "789 Elm St, Springfield"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Parent created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Michael",
    "lastName": "Johnson",
    "email": "michael.johnson@example.com",
    "schoolId": "uuid",
    "occupation": "Engineer",
    "address": "789 Elm St, Springfield",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Link Parent to Student
**Endpoint:** `POST /parents/{parentId}/students`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "studentId": "uuid",
  "relationshipType": "FATHER",
  "isPrimaryContact": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student linked to parent successfully",
  "data": {
    "id": "uuid",
    "parentId": "uuid",
    "studentId": "uuid",
    "relationshipType": "FATHER",
    "isPrimaryContact": true
  }
}
```

### 3. Get Parent by ID
**Endpoint:** `GET /parents/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Parent retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Michael",
    "lastName": "Johnson",
    "email": "michael.johnson@example.com",
    "phoneNumber": "+1234567890",
    "schoolId": "uuid",
    "schoolName": "Springfield High School",
    "occupation": "Engineer",
    "address": "789 Elm St, Springfield",
    "children": [
      {
        "studentId": "uuid",
        "studentName": "Alice Johnson",
        "relationshipType": "FATHER",
        "isPrimaryContact": true
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Get All Parents
**Endpoint:** `GET /parents?page=0&size=10`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Parents retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "firstName": "Michael",
        "lastName": "Johnson",
        "email": "michael.johnson@example.com",
        "occupation": "Engineer"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

---

## Classroom Management APIs

### 1. Create Classroom
**Endpoint:** `POST /classrooms`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "name": "Grade 10-A",
  "level": "10",
  "section": "A",
  "academicYear": "2024-2025",
  "capacity": 30,
  "classTeacherId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Classroom created successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "name": "Grade 10-A",
    "level": "10",
    "section": "A",
    "academicYear": "2024-2025",
    "capacity": 30,
    "classTeacherId": "uuid",
    "classTeacherName": "Robert Smith",
    "studentCount": 0,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Classrooms
**Endpoint:** `GET /classrooms?page=0&size=10&academicYear=2024-2025`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `academicYear` (optional): Filter by academic year
- `level` (optional): Filter by level

**Response:**
```json
{
  "success": true,
  "message": "Classrooms retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "schoolId": "uuid",
        "name": "Grade 10-A",
        "level": "10",
        "section": "A",
        "academicYear": "2024-2025",
        "capacity": 30,
        "classTeacherId": "uuid",
        "classTeacherName": "Robert Smith",
        "studentCount": 25,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Get Classroom by ID
**Endpoint:** `GET /classrooms/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Classroom retrieved successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "schoolName": "Springfield High School",
    "name": "Grade 10-A",
    "level": "10",
    "section": "A",
    "academicYear": "2024-2025",
    "capacity": 30,
    "classTeacherId": "uuid",
    "classTeacherName": "Robert Smith",
    "studentCount": 25,
    "courses": [
      {
        "id": "uuid",
        "subject": "Mathematics",
        "teacherName": "Robert Smith"
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Assign Teacher to Classroom
**Endpoint:** `POST /classrooms/{id}/assign-teacher`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "teacherId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher assigned to classroom successfully",
  "data": {
    "id": "uuid",
    "name": "Grade 10-A",
    "classTeacherId": "uuid",
    "classTeacherName": "Robert Smith"
  }
}
```

### 5. Get Classroom Statistics
**Endpoint:** `GET /classrooms/statistics`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Classroom statistics retrieved successfully",
  "data": {
    "totalClassrooms": 10,
    "totalStudents": 250,
    "averageStudentsPerClass": 25,
    "classroomsByLevel": [
      {
        "level": "10",
        "count": 3
      }
    ]
  }
}
```

---

## Course Management APIs

### 1. Create Course
**Endpoint:** `POST /courses`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "classRoomId": "uuid",
  "teacherId": "uuid",
  "subject": "Advanced Mathematics",
  "subjectCode": "MATH301",
  "description": "Advanced calculus and algebra",
  "schedule": "Mon, Wed, Fri 10:00-11:00",
  "semester": "FIRST_SEMESTER",
  "documents": "[{\"id\":\"doc1\",\"name\":\"Syllabus\",\"url\":\"https://example.com/syllabus.pdf\",\"type\":\"SYLLABUS\",\"uploadedAt\":\"2024-01-15T10:00:00Z\",\"size\":256000}]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "classRoomId": "uuid",
    "classRoomName": "Grade 10-A",
    "teacherId": "uuid",
    "teacherName": "Robert Smith",
    "subject": "Advanced Mathematics",
    "subjectCode": "MATH301",
    "description": "Advanced calculus and algebra",
    "schedule": "Mon, Wed, Fri 10:00-11:00",
    "semester": "FIRST_SEMESTER",
    "documents": "[...]",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Courses
**Endpoint:** `GET /courses?page=0&size=10&classRoomId=uuid`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `classRoomId` (optional): Filter by classroom
- `teacherId` (optional): Filter by teacher
- `semester` (optional): Filter by semester

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "schoolId": "uuid",
        "classRoomId": "uuid",
        "classRoomName": "Grade 10-A",
        "teacherId": "uuid",
        "teacherName": "Robert Smith",
        "subject": "Advanced Mathematics",
        "subjectCode": "MATH301",
        "description": "Advanced calculus and algebra",
        "schedule": "Mon, Wed, Fri 10:00-11:00",
        "semester": "FIRST_SEMESTER",
        "documents": "[...]",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Get Course by ID
**Endpoint:** `GET /courses/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "schoolName": "Springfield High School",
    "classRoomId": "uuid",
    "classRoomName": "Grade 10-A",
    "classRoomLevel": "10",
    "teacherId": "uuid",
    "teacherName": "Robert Smith",
    "teacherEmail": "robert.smith@example.com",
    "subject": "Advanced Mathematics",
    "subjectCode": "MATH301",
    "description": "Advanced calculus and algebra",
    "schedule": "Mon, Wed, Fri 10:00-11:00",
    "semester": "FIRST_SEMESTER",
    "materialCount": 5,
    "documents": "[...]",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Update Course
**Endpoint:** `PUT /courses/{id}`
**Authentication:** Required (SCHOOL_ADMIN or assigned TEACHER)

**Request Body:**
```json
{
  "teacherId": "uuid",
  "subject": "Advanced Mathematics",
  "subjectCode": "MATH301",
  "description": "Updated description",
  "schedule": "Mon, Wed, Fri 11:00-12:00",
  "semester": "FIRST_SEMESTER",
  "documents": "[{\"id\":\"doc2\",\"name\":\"Updated Syllabus\",\"url\":\"https://example.com/syllabus-v2.pdf\",\"type\":\"SYLLABUS\",\"uploadedAt\":\"2024-01-16T10:00:00Z\",\"size\":384000}]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": "uuid",
    "subject": "Advanced Mathematics",
    "description": "Updated description",
    "schedule": "Mon, Wed, Fri 11:00-12:00",
    "documents": "[...]"
  }
}
```

### 5. Delete Course
**Endpoint:** `DELETE /courses/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": null
}
```

---

## Event Management APIs

### 1. Create Event
**Endpoint:** `POST /events`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "title": "Annual Sports Day",
  "description": "School-wide sports competition",
  "eventType": "SPORTS",
  "eventDate": "2024-06-15T09:00:00Z",
  "location": "School Stadium",
  "targetRole": "ALL",
  "imageUrl": "https://example.com/sports-day.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "title": "Annual Sports Day",
    "description": "School-wide sports competition",
    "eventType": "SPORTS",
    "eventDate": "2024-06-15T09:00:00Z",
    "location": "School Stadium",
    "targetRole": "ALL",
    "createdBy": "uuid",
    "imageUrl": "https://example.com/sports-day.jpg",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Events
**Endpoint:** `GET /events?page=0&size=10&upcoming=true`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `upcoming` (optional): Filter upcoming events (true/false)
- `eventType` (optional): Filter by event type
- `targetRole` (optional): Filter by target role

**Response:**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "schoolId": "uuid",
        "title": "Annual Sports Day",
        "description": "School-wide sports competition",
        "eventType": "SPORTS",
        "eventDate": "2024-06-15T09:00:00Z",
        "location": "School Stadium",
        "targetRole": "ALL",
        "createdBy": "uuid",
        "imageUrl": "https://example.com/sports-day.jpg",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Get Event by ID
**Endpoint:** `GET /events/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "title": "Annual Sports Day",
    "description": "School-wide sports competition",
    "eventType": "SPORTS",
    "eventDate": "2024-06-15T09:00:00Z",
    "location": "School Stadium",
    "targetRole": "ALL",
    "createdBy": "uuid",
    "imageUrl": "https://example.com/sports-day.jpg",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Update Event
**Endpoint:** `PUT /events/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "title": "Annual Sports Day Updated",
  "description": "Updated description",
  "eventType": "SPORTS",
  "eventDate": "2024-06-15T10:00:00Z",
  "location": "Main Stadium",
  "targetRole": "ALL",
  "imageUrl": "https://example.com/sports-day-updated.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": "uuid",
    "title": "Annual Sports Day Updated",
    "imageUrl": "https://example.com/sports-day-updated.jpg"
  }
}
```

### 5. Delete Event
**Endpoint:** `DELETE /events/{id}`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": null
}
```

---

## Absence Management APIs

### 1. Create Absence
**Endpoint:** `POST /absences`
**Authentication:** Required (TEACHER or SCHOOL_ADMIN)

**Request Body:**
```json
{
  "studentId": "uuid",
  "courseId": "uuid",
  "date": "2024-01-15",
  "reason": "Sick",
  "justified": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Absence recorded successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "studentId": "uuid",
    "studentName": "Alice Johnson",
    "courseId": "uuid",
    "courseName": "Advanced Mathematics",
    "date": "2024-01-15",
    "reason": "Sick",
    "justified": false,
    "reportedBy": "uuid",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get Student Absences
**Endpoint:** `GET /absences/student/{studentId}?page=0&size=10`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Absences retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "studentName": "Alice Johnson",
        "courseName": "Advanced Mathematics",
        "date": "2024-01-15",
        "reason": "Sick",
        "justified": false
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Justify Absence
**Endpoint:** `PUT /absences/{id}/justify`
**Authentication:** Required (SCHOOL_ADMIN or PARENT)

**Request Body:**
```json
{
  "justificationDocument": "https://example.com/medical-certificate.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Absence justified successfully",
  "data": {
    "id": "uuid",
    "justified": true,
    "justificationDocument": "https://example.com/medical-certificate.pdf"
  }
}
```

### 4. Get Absence Statistics
**Endpoint:** `GET /absences/statistics?studentId=uuid&startDate=2024-01-01&endDate=2024-12-31`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Absence statistics retrieved successfully",
  "data": {
    "totalAbsences": 5,
    "justifiedAbsences": 3,
    "unjustifiedAbsences": 2,
    "absentDays": 5,
    "attendanceRate": 95.5
  }
}
```

---

## Payment Management APIs

### 1. Create Payment
**Endpoint:** `POST /payments`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "studentId": "uuid",
  "amount": 1500.00,
  "paymentType": "TUITION",
  "dueDate": "2024-02-01",
  "invoiceNumber": "INV-2024-001",
  "notes": "Q1 Tuition Fee"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "studentId": "uuid",
    "studentName": "Alice Johnson",
    "amount": 1500.00,
    "paymentType": "TUITION",
    "status": "PENDING",
    "dueDate": "2024-02-01",
    "invoiceNumber": "INV-2024-001",
    "notes": "Q1 Tuition Fee",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Payments
**Endpoint:** `GET /payments?page=0&size=10&status=PENDING&studentId=uuid`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `status` (optional): Filter by status (PENDING, PAID, OVERDUE, etc.)
- `studentId` (optional): Filter by student
- `paymentType` (optional): Filter by payment type

**Response:**
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "studentName": "Alice Johnson",
        "amount": 1500.00,
        "paymentType": "TUITION",
        "status": "PENDING",
        "dueDate": "2024-02-01",
        "invoiceNumber": "INV-2024-001"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Mark Payment as Paid
**Endpoint:** `PUT /payments/{id}/mark-paid`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "paidDate": "2024-01-20",
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment marked as paid successfully",
  "data": {
    "id": "uuid",
    "status": "PAID",
    "paidDate": "2024-01-20",
    "paymentMethod": "CREDIT_CARD",
    "transactionId": "TXN123456789"
  }
}
```

### 4. Get Payment Statistics
**Endpoint:** `GET /payments/statistics?startDate=2024-01-01&endDate=2024-12-31`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Payment statistics retrieved successfully",
  "data": {
    "totalRevenue": 150000.00,
    "paidAmount": 120000.00,
    "pendingAmount": 30000.00,
    "overdueAmount": 5000.00,
    "collectionRate": 80.0,
    "byPaymentType": [
      {
        "paymentType": "TUITION",
        "amount": 100000.00
      }
    ]
  }
}
```

---

## Notification Management APIs

### 1. Send Notification
**Endpoint:** `POST /notifications`
**Authentication:** Required (SCHOOL_ADMIN or TEACHER)

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "New Assignment Posted",
  "message": "A new assignment has been posted for Mathematics",
  "notificationType": "ASSIGNMENT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "userId": "uuid",
    "title": "New Assignment Posted",
    "message": "A new assignment has been posted for Mathematics",
    "notificationType": "ASSIGNMENT",
    "readStatus": false,
    "sentAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get User Notifications
**Endpoint:** `GET /notifications?page=0&size=10&unreadOnly=true`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `unreadOnly` (optional): Show only unread notifications

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "title": "New Assignment Posted",
        "message": "A new assignment has been posted for Mathematics",
        "notificationType": "ASSIGNMENT",
        "readStatus": false,
        "sentAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Mark Notification as Read
**Endpoint:** `PUT /notifications/{id}/read`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": "uuid",
    "readStatus": true,
    "readAt": "2024-01-15T11:00:00Z"
  }
}
```

### 4. Mark All as Read
**Endpoint:** `PUT /notifications/mark-all-read`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updatedCount": 5
  }
}
```

### 5. Send Bulk Notification
**Endpoint:** `POST /notifications/bulk`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "targetRole": "STUDENT",
  "title": "School Holiday Announcement",
  "message": "The school will be closed on January 20th",
  "notificationType": "ANNOUNCEMENT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk notifications sent successfully",
  "data": {
    "sentCount": 150
  }
}
```

---

## Issue Management APIs

### 1. Create Issue
**Endpoint:** `POST /issues`
**Authentication:** Required

**Request Body:**
```json
{
  "title": "Library AC not working",
  "description": "The air conditioning in the library has not been working for 2 days",
  "issueType": "FACILITIES",
  "priority": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "reportedBy": "uuid",
    "reportedByName": "John Doe",
    "title": "Library AC not working",
    "description": "The air conditioning in the library has not been working for 2 days",
    "issueType": "FACILITIES",
    "priority": "HIGH",
    "status": "OPEN",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Issues
**Endpoint:** `GET /issues?page=0&size=10&status=OPEN&priority=HIGH`
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `issueType` (optional): Filter by issue type
- `assignedTo` (optional): Filter by assigned user

**Response:**
```json
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "title": "Library AC not working",
        "issueType": "FACILITIES",
        "priority": "HIGH",
        "status": "OPEN",
        "reportedByName": "John Doe",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 3. Assign Issue
**Endpoint:** `PUT /issues/{id}/assign`
**Authentication:** Required (SCHOOL_ADMIN)

**Request Body:**
```json
{
  "assignedTo": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Issue assigned successfully",
  "data": {
    "id": "uuid",
    "assignedTo": "uuid",
    "assignedToName": "Jane Smith",
    "status": "IN_PROGRESS"
  }
}
```

### 4. Add Comment to Issue
**Endpoint:** `POST /issues/{id}/comments`
**Authentication:** Required

**Request Body:**
```json
{
  "comment": "We are looking into this issue and will have it fixed by tomorrow"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": "uuid",
    "issueId": "uuid",
    "userId": "uuid",
    "userName": "Jane Smith",
    "comment": "We are looking into this issue and will have it fixed by tomorrow",
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

### 5. Resolve Issue
**Endpoint:** `PUT /issues/{id}/resolve`
**Authentication:** Required

**Request Body:**
```json
{
  "resolution": "AC has been repaired and is now working properly"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Issue resolved successfully",
  "data": {
    "id": "uuid",
    "status": "RESOLVED",
    "resolution": "AC has been repaired and is now working properly",
    "resolvedAt": "2024-01-16T14:00:00Z"
  }
}
```

---

## Document Management APIs

### File Storage Overview

The application uses a flexible storage architecture that currently stores files locally but can be easily migrated to AWS S3.

**Local Storage Configuration:**
- Base Path: `C:\saas-school` (configurable via `STORAGE_PATH` environment variable)
- Organization: `{base-path}/school_{schoolId}/{entityType}/{entityId}/{filename}`
- Max File Size: 10MB (configurable)
- Supported File Types: PDF, JPEG, PNG, GIF, DOC, DOCX, XLS, XLSX

**Storage Organization Example:**
```
C:\saas-school\
├── school_123e4567-e89b-12d3-a456-426614174000\
│   ├── STUDENT\
│   │   ├── 456e7890-e89b-12d3-a456-426614174001\
│   │   │   ├── birth-certificate.pdf
│   │   │   └── id-card.jpg
│   │   └── 456e7890-e89b-12d3-a456-426614174002\
│   │       └── transcript.pdf
│   ├── TEACHER\
│   │   └── 789e1234-e89b-12d3-a456-426614174003\
│   │       ├── teaching-certificate.pdf
│   │       └── cv.pdf
│   └── COURSE\
│       └── 012e3456-e89b-12d3-a456-426614174004\
│           ├── syllabus.pdf
│           └── lecture-notes.pdf
```

### 1. Upload Document
**Endpoint:** `POST /api/documents/upload`
**Authentication:** Required
**Content-Type:** multipart/form-data

**Request Body (Form Data):**
- `file`: The file to upload (Max 10MB)
- `entityType`: Entity type (student, teacher, course, payment, etc.)
- `entityId`: UUID of the entity
- `title`: Document title/description

**Curl Example:**
```bash
curl -X POST "http://localhost:8080/api/documents/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "entityType=STUDENT" \
  -F "entityId=456e7890-e89b-12d3-a456-426614174001" \
  -F "title=Birth Certificate"
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "schoolId": "123e4567-e89b-12d3-a456-426614174000",
    "entityType": "STUDENT",
    "entityId": "456e7890-e89b-12d3-a456-426614174001",
    "title": "Birth Certificate",
    "filePath": "school_123e4567-e89b-12d3-a456-426614174000/STUDENT/456e7890-e89b-12d3-a456-426614174001/document.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "uploadedBy": "uuid",
    "uploadedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Download Document
**Endpoint:** `GET /api/documents/download?path={filePath}`
**Authentication:** Required

**Query Parameters:**
- `path` (required): The relative file path returned from upload

**Example:**
```
GET /api/documents/download?path=school_123e4567/STUDENT/456e7890/document.pdf
```

**Response:**
- Returns the file as a downloadable attachment
- Content-Type: Automatically detected based on file type
- Content-Disposition: attachment; filename="document.pdf"

**Curl Example:**
```bash
curl -X GET "http://localhost:8080/api/documents/download?path=school_123e4567/STUDENT/456e7890/document.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o downloaded-file.pdf
```

### 3. Get Document by ID
**Endpoint:** `GET /api/documents/{id}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Document retrieved successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "entityType": "STUDENT",
    "entityId": "uuid",
    "title": "Birth Certificate",
    "filePath": "school_123e4567/STUDENT/456e7890/document.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "uploadedBy": "uuid",
    "uploadedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 4. Get Documents by Entity
**Endpoint:** `GET /api/documents/entity/{entityType}/{entityId}`
**Authentication:** Required

**Path Parameters:**
- `entityType`: Entity type (STUDENT, TEACHER, COURSE, etc.)
- `entityId`: UUID of the entity

**Response:**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Birth Certificate",
      "filePath": "school_123e4567/STUDENT/456e7890/document.pdf",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "uploadedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "title": "ID Card",
      "filePath": "school_123e4567/STUDENT/456e7890/id-card.jpg",
      "fileType": "image/jpeg",
      "fileSize": 512000,
      "uploadedAt": "2024-01-16T10:00:00Z"
    }
  ]
}
```

### 5. Get All School Documents
**Endpoint:** `GET /api/documents`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "entityType": "STUDENT",
      "entityId": "uuid",
      "title": "Birth Certificate",
      "filePath": "school_123e4567/STUDENT/456e7890/document.pdf",
      "fileSize": 1024000,
      "uploadedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 6. Delete Document
**Endpoint:** `DELETE /api/documents/{id}`
**Authentication:** Required (SCHOOL_ADMIN or TEACHER)

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": null
}
```

**Note:** This also deletes the physical file from the storage system.

### 7. Get Storage Usage
**Endpoint:** `GET /api/documents/storage-used`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Storage usage retrieved successfully",
  "data": 157286400
}
```

**Note:** Returns total storage used in bytes. Divide by 1024^3 to get GB.

---

## Subscription Management APIs

### 1. Create Subscription Plan
**Endpoint:** `POST /subscription-plans`
**Authentication:** Required (SUPER_ADMIN)

**Request Body:**
```json
{
  "name": "Premium",
  "description": "Premium plan with all features",
  "monthlyPrice": 499.99,
  "yearlyPrice": 4999.99,
  "maxStudents": 500,
  "maxTeachers": 50,
  "maxStorageGb": 100,
  "maxClasses": 50,
  "features": [
    {
      "featureType": "ANALYTICS",
      "enabled": true
    },
    {
      "featureType": "CHAT",
      "enabled": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription plan created successfully",
  "data": {
    "id": "uuid",
    "name": "Premium",
    "description": "Premium plan with all features",
    "monthlyPrice": 499.99,
    "yearlyPrice": 4999.99,
    "maxStudents": 500,
    "maxTeachers": 50,
    "maxStorageGb": 100,
    "maxClasses": 50,
    "active": true,
    "features": [
      {
        "featureType": "ANALYTICS",
        "enabled": true
      }
    ]
  }
}
```

### 2. Get All Subscription Plans
**Endpoint:** `GET /subscription-plans?activeOnly=true`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Subscription plans retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Premium",
      "description": "Premium plan with all features",
      "monthlyPrice": 499.99,
      "yearlyPrice": 4999.99,
      "maxStudents": 500,
      "maxTeachers": 50,
      "active": true
    }
  ]
}
```

### 3. Create Subscription
**Endpoint:** `POST /subscriptions`
**Authentication:** Required (SUPER_ADMIN)

**Request Body:**
```json
{
  "schoolId": "uuid",
  "subscriptionPlanId": "uuid",
  "startDate": "2024-01-15",
  "endDate": "2025-01-15",
  "billingCycle": "YEARLY",
  "autoRenew": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "planName": "Premium",
    "status": "ACTIVE",
    "startDate": "2024-01-15",
    "endDate": "2025-01-15",
    "billingCycle": "YEARLY",
    "autoRenew": true
  }
}
```

### 4. Get School Subscription
**Endpoint:** `GET /subscriptions/school/{schoolId}`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Subscription retrieved successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "planName": "Premium",
    "status": "ACTIVE",
    "startDate": "2024-01-15",
    "endDate": "2025-01-15",
    "billingCycle": "YEARLY",
    "autoRenew": true,
    "limits": {
      "maxStudents": 500,
      "currentStudents": 150,
      "maxTeachers": 50,
      "currentTeachers": 20,
      "maxClasses": 50,
      "currentClasses": 10
    }
  }
}
```

---

## Dashboard APIs

### 1. Super Admin Dashboard
**Endpoint:** `GET /dashboard/super-admin`
**Authentication:** Required (SUPER_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "kpiCards": [
      {
        "title": "Total Schools",
        "value": 25,
        "change": 5.2,
        "trend": "up"
      },
      {
        "title": "Active Subscriptions",
        "value": 23,
        "change": 3.1,
        "trend": "up"
      },
      {
        "title": "Monthly Revenue",
        "value": 12500.00,
        "change": 8.5,
        "trend": "up"
      }
    ],
    "revenueTrend": [
      {
        "month": "Jan",
        "revenue": 10000.00
      },
      {
        "month": "Feb",
        "revenue": 12500.00
      }
    ],
    "subscriptionDistribution": [
      {
        "planName": "Basic",
        "count": 10
      },
      {
        "planName": "Premium",
        "count": 15
      }
    ],
    "newSchools": [
      {
        "schoolName": "Springfield High",
        "registrationDate": "2024-01-15",
        "subscriptionPlan": "Premium"
      }
    ]
  }
}
```

### 2. School Admin Dashboard
**Endpoint:** `GET /dashboard/school-admin`
**Authentication:** Required (SCHOOL_ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "kpiCards": [
      {
        "title": "Total Students",
        "value": 150,
        "change": 2.5,
        "trend": "up"
      },
      {
        "title": "Total Teachers",
        "value": 20,
        "change": 0,
        "trend": "stable"
      },
      {
        "title": "Attendance Rate",
        "value": 95.5,
        "change": 1.2,
        "trend": "up"
      }
    ],
    "enrollmentTrend": [
      {
        "month": "Jan",
        "students": 145
      },
      {
        "month": "Feb",
        "students": 150
      }
    ],
    "attendanceChart": [
      {
        "date": "2024-01-15",
        "presentCount": 143,
        "absentCount": 7
      }
    ],
    "paymentCollection": {
      "collected": 120000.00,
      "pending": 30000.00,
      "overdue": 5000.00
    },
    "recentActivity": [
      {
        "type": "NEW_STUDENT",
        "description": "Alice Johnson enrolled",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## Chat Management APIs

### 1. Send Message
**Endpoint:** `POST /chat/messages`
**Authentication:** Required

**Request Body:**
```json
{
  "courseId": "uuid",
  "message": "Hello, does anyone have the homework for today?",
  "messageType": "TEXT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "uuid",
    "schoolId": "uuid",
    "courseId": "uuid",
    "senderId": "uuid",
    "senderName": "Alice Johnson",
    "message": "Hello, does anyone have the homework for today?",
    "messageType": "TEXT",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get Course Messages
**Endpoint:** `GET /chat/messages/course/{courseId}?page=0&size=50`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "senderId": "uuid",
        "senderName": "Alice Johnson",
        "message": "Hello, does anyone have the homework for today?",
        "messageType": "TEXT",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 50
  }
}
```

---

## Audit Log APIs

### 1. Get Audit Logs
**Endpoint:** `GET /audit-logs?page=0&size=10&action=CREATE&entityType=STUDENT`
**Authentication:** Required (SCHOOL_ADMIN or SUPER_ADMIN)

**Query Parameters:**
- `page` (optional): Page number
- `size` (optional): Page size
- `action` (optional): Filter by action (CREATE, UPDATE, DELETE)
- `entityType` (optional): Filter by entity type
- `userId` (optional): Filter by user
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response:**
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "content": [
      {
        "id": "uuid",
        "schoolId": "uuid",
        "userId": "uuid",
        "username": "john.doe@example.com",
        "action": "CREATE",
        "entityType": "STUDENT",
        "entityId": "uuid",
        "oldValue": null,
        "newValue": "{\"firstName\":\"Alice\",\"lastName\":\"Johnson\"}",
        "ipAddress": "192.168.1.1",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error occurred",
  "data": null
}
```

---

## Getting Started

### Prerequisites
- Java 17 or higher
- PostgreSQL 14 or higher
- Maven 3.8 or higher

### Running the Backend

1. Clone the repository
2. Configure database connection in `application.yml`
3. Run migrations: `mvn flyway:migrate`
4. Start the application: `mvn spring-boot:run`

The API will be available at `http://localhost:8080`

### API Documentation (Swagger)
Once the application is running, you can access the interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

---

## Notes

1. **Authentication**: Most endpoints require a valid JWT token. Include it in the `Authorization` header as `Bearer <token>`

2. **Pagination**: List endpoints support pagination with `page` and `size` query parameters. Default page is 0 and default size is 10.

3. **Filtering**: Many endpoints support filtering through query parameters. Check individual endpoint documentation for available filters.

4. **JSONB Fields**: Fields like `administrativeDocuments` and `documents` are stored as JSONB and should be valid JSON strings representing arrays of document objects.

5. **File Uploads**: Document upload endpoints use multipart/form-data. Make sure to set the correct Content-Type header.

6. **Date Formats**: Use ISO 8601 format for dates and timestamps (e.g., `2024-01-15` for dates, `2024-01-15T10:00:00Z` for timestamps).

7. **Role-Based Access**: Different endpoints require different roles (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT). Make sure to use appropriate credentials.

8. **File Storage**: Files are currently stored locally in `C:\saas-school` with organized folder structure by school and entity type. The architecture is designed for easy migration to AWS S3 or other cloud storage providers.

---

## File Storage Configuration

### Current Setup: Local Storage

The application stores files locally on disk with the following structure:

**Default Location:** `C:\saas-school`

**Configurable via Environment Variable:**
```bash
STORAGE_PATH=C:/saas-school
```

**Folder Organization:**
```
{base-path}/school_{schoolId}/{entityType}/{entityId}/{filename}
```

This organization ensures:
- Easy data separation by school (multi-tenancy)
- Clear categorization by entity type
- Simple backup and migration strategies
- Minimal cross-contamination of data

### Migrating to AWS S3

The storage architecture uses an interface-based design (`StorageService`) that allows easy migration to AWS S3. Here's how to migrate:

#### Step 1: Create S3StorageServiceImpl

Create a new implementation of `StorageService`:

```java
@Service
@Primary  // Use this implementation instead of LocalStorageServiceImpl
@RequiredArgsConstructor
public class S3StorageServiceImpl implements StorageService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    private final AmazonS3 s3Client;

    @Override
    public String uploadFile(MultipartFile file, String entityType, UUID entityId, UUID schoolId) {
        String key = String.format("school_%s/%s/%s/%s",
            schoolId, entityType, entityId, generateUniqueFilename(file));

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            s3Client.putObject(bucketName, key, file.getInputStream(), metadata);
            return key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to S3", e);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        s3Client.deleteObject(bucketName, filePath);
    }

    @Override
    public String generateFileUrl(String filePath) {
        return s3Client.generatePresignedUrl(
            bucketName,
            filePath,
            Date.from(Instant.now().plus(Duration.ofHours(1)))
        ).toString();
    }

    @Override
    public long calculateStorageUsed(UUID schoolId) {
        // Implementation to calculate S3 storage usage
        return 0L;
    }
}
```

#### Step 2: Add AWS Dependencies

Add to `pom.xml`:

```xml
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-s3</artifactId>
    <version>1.12.529</version>
</dependency>
```

#### Step 3: Configure AWS S3

Add to `application.yml`:

```yaml
aws:
  s3:
    bucket-name: ${AWS_S3_BUCKET:school-saas-storage}
    region: ${AWS_REGION:us-east-1}
    access-key: ${AWS_ACCESS_KEY}
    secret-key: ${AWS_SECRET_KEY}
```

#### Step 4: Update Environment Variables

```bash
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
```

#### Step 5: Migrate Existing Files

Create a migration script to copy files from local storage to S3:

```java
@Component
public class StorageMigrationService {

    public void migrateLocalToS3() {
        Path localPath = Paths.get("C:/saas-school");

        Files.walk(localPath)
            .filter(Files::isRegularFile)
            .forEach(file -> {
                String relativePath = localPath.relativize(file).toString();
                // Upload to S3 with same folder structure
                uploadToS3(file, relativePath);
            });
    }
}
```

### Alternative Storage Options

The same `StorageService` interface can be implemented for:

1. **Azure Blob Storage**
2. **Google Cloud Storage**
3. **MinIO (self-hosted S3-compatible)**
4. **Digital Ocean Spaces**

Simply create a new implementation and mark it with `@Primary` to switch storage providers.

### Storage Best Practices

1. **Backup Strategy**: Regularly backup the `C:\saas-school` folder or configure S3 versioning
2. **File Naming**: Files are automatically renamed with UUIDs to prevent conflicts
3. **Access Control**: All file operations require authentication and proper authorization
4. **Validation**: File types and sizes are validated before upload
5. **Cleanup**: Deleted documents are automatically removed from storage

### Monitoring Storage Usage

Each school's storage usage can be monitored via the API:

```
GET /api/documents/storage-used
```

This helps track storage costs and enforce subscription limits.
