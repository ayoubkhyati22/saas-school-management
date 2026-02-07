# School SaaS Platform

A comprehensive multi-tenant School Management System built with Spring Boot 3.2, PostgreSQL, and modern Java technologies.

---

## ⚠️ Important: This is a Java Spring Boot Application

**If you encountered an npm build error**, this is because your deployment platform detected `package.json` and assumed this was a Node.js project.

**This is actually a Java application** that requires Java 17 and Maven.

### Quick Fixes:
1. **Use Docker** (recommended): `docker-compose up --build`
2. **Deploy to Java platform**: Railway, Heroku, AWS, Azure, GCP
3. **See detailed instructions**: [DEPLOYMENT_ERROR_FIX.md](DEPLOYMENT_ERROR_FIX.md)

**Full deployment guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## Features

### Multi-Tenancy
- Complete data isolation between schools
- Tenant-aware queries and security
- Subscription-based access control

### User Management
- Role-based access control (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT)
- JWT authentication and authorization
- User profile management

### Subscription Management
- Multiple subscription plans (Basic, Standard, Premium)
- Billing cycle support (Monthly/Yearly)
- Feature-based access control
- Usage limits (students, teachers, storage, classes)

### Academic Management
- Student enrollment and management
- Teacher profiles and assignments
- Classroom organization
- Course management with materials
- Absence tracking and justification

### Financial Management
- Payment tracking and invoicing
- Overdue payment detection
- Payment reminders and notifications
- Multiple payment types support

### Communication
- Real-time chat via WebSocket
- System notifications
- Event management and calendar
- Email notifications (integrated)

### Support & Monitoring
- Issue tracking system
- Audit logging for compliance
- Comprehensive dashboard for admins
- Analytics and reporting

### Scheduled Tasks
- Automatic subscription expiration checks
- Payment reminders
- Weekly attendance reports
- Storage usage monitoring
- Auto-assignment of critical issues

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
  - Spring Data JPA
  - Spring Security
  - Spring WebSocket
  - Spring AOP
- **PostgreSQL** (via Supabase)
- **Flyway** for database migrations
- **JWT** for authentication
- **MapStruct** for DTO mapping
- **Lombok** for boilerplate reduction
- **Swagger/OpenAPI 3.0** for API documentation

### Build & Deployment
- **Maven 3.9+**
- **Docker** and Docker Compose
- **Git** for version control

## Architecture

### Multi-Tenant Architecture
The application implements a **schema-per-tenant** approach with logical separation:
- Each school (tenant) is identified by `schoolId`
- All queries are filtered by tenant context
- Tenant information is extracted from JWT token
- ThreadLocal context ensures tenant isolation

### Security
- JWT-based authentication
- Role-based authorization with @PreAuthorize
- Password encryption using BCrypt
- CORS enabled for cross-origin requests
- Audit logging for all critical operations

### Database Schema
- 19 core tables
- 15 PostgreSQL ENUMs for type safety
- 92+ indexes for optimal performance
- Comprehensive foreign key relationships

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.9+
- Docker and Docker Compose (optional)
- PostgreSQL database (or use provided Supabase instance)

### Configuration

1. **Clone the repository**
```bash
git clone <repository-url>
cd school-saas-platform
```

2. **Configure database connection**

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://your-host:5432/your-database
    username: your-username
    password: your-password
```

Or set environment variables:
```bash
export DB_PASSWORD=your-password
export JWT_SECRET=your-secret-key
export STORAGE_PATH=/path/to/storage
```

3. **Build the application**
```bash
mvn clean package
```

4. **Run the application**
```bash
java -jar target/school-saas-platform-1.0.0.jar
```

The application will start on `http://localhost:8080`

### Using Docker

1. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

This will:
- Build the Spring Boot application
- Start the application on port 8080
- Create necessary volumes for file storage

2. **Stop the application**
```bash
docker-compose down
```

### Database Migrations

Flyway migrations run automatically on startup. The following migrations are applied:

1. **V1** - Create base tables (schools, subscriptions, plans)
2. **V2** - Create user tables (users, students, teachers, parents)
3. **V3** - Create academic tables (classrooms, courses)
4. **V4** - Create communication tables (chat, notifications, events)
5. **V5** - Create financial tables (payments, documents)
6. **V6** - Create support tables (issues, absences, audit logs)
7. **V7** - Create performance indexes

### Test Data

On first startup, the application automatically loads test data including:
- 1 Super Admin
- 2 Schools (Green Valley High School, Sunshine Academy)
- 3 Subscription Plans (Basic, Standard, Premium)
- 2 School Admins
- 5 Teachers
- 8 Students
- 3 Parents
- 5 Courses
- Sample payments, events, notifications, and more

## API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

### OpenAPI Specification
```
http://localhost:8080/api-docs
```

### Authentication

All endpoints (except `/api/auth/**`) require authentication via JWT token.

**Login Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoolsaas.com",
    "password": "SuperAdmin@123"
  }'
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
    "expiresIn": 900000,
    "user": {
      "id": "...",
      "email": "admin@schoolsaas.com",
      "firstName": "Super",
      "lastName": "Admin",
      "role": "SUPER_ADMIN"
    }
  }
}
```

**Authenticated Request:**
```bash
curl -X GET http://localhost:8080/api/schools \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Test Credentials

### Super Admin
- **Email:** admin@schoolsaas.com
- **Password:** SuperAdmin@123
- **Access:** Full platform access, all schools

### School Admin (Green Valley)
- **Email:** admin@greenvalley.edu
- **Password:** SchoolAdmin@123
- **Access:** Green Valley High School management

### School Admin (Sunshine)
- **Email:** admin@sunshine.edu
- **Password:** SchoolAdmin@123
- **Access:** Sunshine Academy management

### Teacher
- **Email:** math.teacher@greenvalley.edu
- **Password:** Teacher@123
- **Access:** Course and student management

### Parent
- **Email:** parent1@example.com
- **Password:** Parent@123
- **Access:** View children's information

### Student
- **Email:** alice.student@greenvalley.edu
- **Password:** Student@123
- **Access:** View courses and assignments

## Project Structure

```
school-saas-platform/
├── src/
│   ├── main/
│   │   ├── java/com/school/saas/
│   │   │   ├── common/              # Base classes and enums
│   │   │   ├── config/              # Spring configuration
│   │   │   ├── security/            # JWT and security components
│   │   │   ├── exception/           # Custom exceptions
│   │   │   ├── dto/                 # Common DTOs
│   │   │   ├── module/              # Business modules
│   │   │   │   ├── auth/           # Authentication
│   │   │   │   ├── school/         # School management
│   │   │   │   ├── subscription/   # Subscription & billing
│   │   │   │   ├── user/           # User management
│   │   │   │   ├── student/        # Student management
│   │   │   │   ├── teacher/        # Teacher management
│   │   │   │   ├── parent/         # Parent management
│   │   │   │   ├── classroom/      # Classroom management
│   │   │   │   ├── course/         # Course management
│   │   │   │   ├── chat/           # Real-time chat
│   │   │   │   ├── absence/        # Absence tracking
│   │   │   │   ├── payment/        # Payment management
│   │   │   │   ├── document/       # Document storage
│   │   │   │   ├── event/          # Event management
│   │   │   │   ├── notification/   # Notifications
│   │   │   │   ├── issue/          # Issue tracking
│   │   │   │   ├── dashboard/      # Analytics dashboards
│   │   │   │   ├── audit/          # Audit logging
│   │   │   │   └── scheduler/      # Scheduled tasks
│   │   │   └── SchoolSaasApplication.java
│   │   └── resources/
│   │       ├── db/migration/       # Flyway migrations
│   │       ├── application.yml     # Application config
│   │       └── static/             # Static resources
│   └── test/                       # Unit and integration tests
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Docker build configuration
├── pom.xml                         # Maven dependencies
└── README.md                       # This file
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### School Management (SUPER_ADMIN only)
- `GET /api/schools` - List all schools
- `POST /api/schools` - Create school
- `GET /api/schools/{id}` - Get school details
- `PUT /api/schools/{id}` - Update school
- `DELETE /api/schools/{id}` - Delete school

### Subscription Management
- `GET /api/subscription-plans` - List plans
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/school/{schoolId}` - Get school subscription

### Student Management
- `GET /api/students` - List students (paginated)
- `POST /api/students` - Create student
- `GET /api/students/{id}` - Get student details
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- `GET /api/students/search?keyword=` - Search students
- `GET /api/students/statistics` - Get statistics

### Teacher Management
- `GET /api/teachers` - List teachers
- `POST /api/teachers` - Create teacher
- Similar CRUD operations as students

### Classroom Management
- `GET /api/classrooms` - List classrooms
- `POST /api/classrooms` - Create classroom
- `GET /api/classrooms/{id}/students` - Get classroom students
- `PUT /api/classrooms/{id}/assign-teacher` - Assign class teacher
- `GET /api/classrooms/{id}/statistics` - Get classroom stats

### Course Management
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `POST /api/courses/{id}/materials` - Upload course material
- `GET /api/courses/{id}/materials` - Get course materials

### Payment Management
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}/mark-paid` - Mark as paid
- `GET /api/payments/overdue` - Get overdue payments
- `GET /api/payments/statistics` - Payment statistics

### Dashboard
- `GET /api/dashboard/school-admin/overview` - School admin dashboard
- `GET /api/dashboard/school-admin/enrollment-trend` - Enrollment trends
- `GET /api/dashboard/super-admin/overview` - Super admin dashboard
- `GET /api/dashboard/super-admin/revenue-trend` - Revenue trends

### Chat (WebSocket)
- WebSocket endpoint: `/ws/chat`
- Subscribe to: `/topic/course/{courseId}`
- Send message: `/app/chat.send/{courseId}`

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PUT /api/notifications/{id}/mark-read` - Mark as read

### Issue Tracking
- `GET /api/issues` - List issues
- `POST /api/issues` - Create issue
- `PUT /api/issues/{id}/assign` - Assign to admin
- `PUT /api/issues/{id}/resolve` - Resolve issue
- `POST /api/issues/{id}/comments` - Add comment

## Deployment

### Environment Variables

Set the following environment variables for production:

```bash
# Database
DB_PASSWORD=your-production-password

# JWT
JWT_SECRET=your-production-secret-256-bits-minimum

# Storage
STORAGE_PATH=/var/school-saas-storage

# Server
SERVER_PORT=8080
```

### Production Considerations

1. **Database**: Use a dedicated PostgreSQL instance with backups
2. **File Storage**: Configure persistent volume for file storage
3. **Security**:
   - Use strong JWT secret (256+ bits)
   - Enable HTTPS/TLS
   - Configure firewall rules
4. **Monitoring**: Add application monitoring (e.g., Prometheus, Grafana)
5. **Logging**: Configure log aggregation (e.g., ELK stack)
6. **Backup**: Implement regular database and file backups

### Docker Production Deployment

```bash
# Build for production
docker build -t school-saas-platform:latest .

# Run with environment variables
docker run -d \
  -p 8080:8080 \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  -v /var/school-saas-storage:/app/storage \
  --name school-saas \
  school-saas-platform:latest
```

## Scheduled Tasks

The application runs the following scheduled tasks:

1. **Subscription Expiration Check** (Daily at 00:00)
   - Warns about subscriptions expiring in 7 days
   - Marks expired subscriptions

2. **Payment Reminders** (Daily at 08:00)
   - Sends reminders for payments due in 3 days
   - Notifies about overdue payments

3. **Weekly Attendance Report** (Every Monday at 09:00)
   - Generates attendance summary
   - Sends to admins and teachers

4. **Storage Usage Calculation** (Daily at 02:00)
   - Calculates storage per school
   - Alerts when nearing limit

5. **Auto-assign Critical Issues** (Every 15 minutes)
   - Assigns unassigned critical issues
   - Balances workload among admins

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact: support@schoolsaas.com

## License

Copyright © 2024 School SaaS Platform. All rights reserved.

---

**Built with ❤️ using Spring Boot**
