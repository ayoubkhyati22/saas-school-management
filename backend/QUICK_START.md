# Quick Start Guide

## Prerequisites

- Java 17 or higher
- Maven 3.9+
- PostgreSQL database (Supabase provided)

## Step 1: Configure Database

The project is pre-configured to use Supabase PostgreSQL. Update the password in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    password: ${DB_PASSWORD:your-supabase-password}
```

Or set environment variable:
```bash
export DB_PASSWORD=your-supabase-password
```

## Step 2: Build the Project

```bash
mvn clean package
```

This will:
- Compile all Java classes
- Run annotation processors (Lombok, MapStruct)
- Generate JAR file in `target/` directory

## Step 3: Run the Application

```bash
java -jar target/school-saas-platform-1.0.0.jar
```

The application will:
1. Connect to PostgreSQL database
2. Run Flyway migrations (create all tables)
3. Load test data (60+ test entities)
4. Start on port 8080

## Step 4: Access the Application

### Swagger UI (API Documentation)
```
http://localhost:8080/swagger-ui.html
```

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

## Step 5: Login

### Using cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoolsaas.com",
    "password": "SuperAdmin@123"
  }'
```

### Response
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
      "id": "uuid",
      "email": "admin@schoolsaas.com",
      "firstName": "Super",
      "lastName": "Admin",
      "role": "SUPER_ADMIN"
    }
  }
}
```

## Step 6: Make Authenticated Requests

Copy the `accessToken` from login response:

```bash
curl -X GET http://localhost:8080/api/schools \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Test Credentials

### Super Admin (Full Access)
- **Email:** admin@schoolsaas.com
- **Password:** SuperAdmin@123

### School Admin - Green Valley
- **Email:** admin@greenvalley.edu
- **Password:** SchoolAdmin@123

### School Admin - Sunshine Academy
- **Email:** admin@sunshine.edu
- **Password:** SchoolAdmin@123

### Teacher
- **Email:** math.teacher@greenvalley.edu
- **Password:** Teacher@123

### Parent
- **Email:** parent1@example.com
- **Password:** Parent@123

### Student
- **Email:** alice.student@greenvalley.edu
- **Password:** Student@123

## Docker Quick Start

### Using Docker Compose

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

### Using Docker Only

```bash
# Build image
docker build -t school-saas-platform:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  -v $(pwd)/storage:/app/storage \
  --name school-saas \
  school-saas-platform:latest

# View logs
docker logs -f school-saas

# Stop container
docker stop school-saas
```

## Common API Endpoints

### Authentication
```bash
# Login
POST /api/auth/login

# Get current user
GET /api/auth/me

# Refresh token
POST /api/auth/refresh
```

### Schools (SUPER_ADMIN)
```bash
# List all schools
GET /api/schools

# Get school details
GET /api/schools/{id}

# Create school
POST /api/schools
```

### Students
```bash
# List students
GET /api/students

# Search students
GET /api/students/search?keyword=alice

# Get statistics
GET /api/students/statistics

# Create student
POST /api/students
```

### Teachers
```bash
# List teachers
GET /api/teachers

# Search by speciality
GET /api/teachers/speciality/Mathematics

# Get statistics
GET /api/teachers/statistics
```

### Classrooms
```bash
# List classrooms
GET /api/classrooms

# Get classroom students
GET /api/classrooms/{id}/students

# Assign teacher
PUT /api/classrooms/{id}/assign-teacher
```

### Courses
```bash
# List courses
GET /api/courses

# Upload material
POST /api/courses/{id}/materials

# Get materials
GET /api/courses/{id}/materials
```

### Payments
```bash
# List payments
GET /api/payments

# Mark as paid
PUT /api/payments/{id}/mark-paid

# Get overdue payments
GET /api/payments/overdue

# Get statistics
GET /api/payments/statistics
```

### Dashboard
```bash
# School Admin Dashboard
GET /api/dashboard/school-admin/overview
GET /api/dashboard/school-admin/enrollment-trend
GET /api/dashboard/school-admin/payment-collection

# Super Admin Dashboard
GET /api/dashboard/super-admin/overview
GET /api/dashboard/super-admin/revenue-trend
GET /api/dashboard/super-admin/new-schools
```

### Notifications
```bash
# Get notifications
GET /api/notifications

# Get unread count
GET /api/notifications/unread/count

# Mark as read
PUT /api/notifications/{id}/mark-read

# Mark all as read
PUT /api/notifications/mark-all-read
```

## WebSocket Chat

### Connect to WebSocket

```javascript
const socket = new SockJS('http://localhost:8080/ws/chat');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);

    // Subscribe to course chat
    stompClient.subscribe('/topic/course/{courseId}', function (message) {
        console.log('Received:', JSON.parse(message.body));
    });

    // Send message
    stompClient.send('/app/chat.send/{courseId}', {}, JSON.stringify({
        message: 'Hello!',
        messageType: 'TEXT'
    }));
});
```

## Environment Variables

### Required
```bash
DB_PASSWORD=your-database-password
```

### Optional
```bash
JWT_SECRET=your-jwt-secret-256-bits
STORAGE_PATH=/path/to/storage
SERVER_PORT=8080
```

## Troubleshooting

### Database Connection Failed
- Check PostgreSQL is running
- Verify database credentials in application.yml
- Ensure database exists

### Port 8080 Already in Use
```bash
# Change port in application.yml
server:
  port: 8081

# Or use environment variable
export SERVER_PORT=8081
```

### Flyway Migration Failed
```bash
# Clean and rebuild
mvn clean package

# Or manually reset database and restart
```

### Cannot Login
- Verify test data loaded (check logs)
- Use exact credentials from test data
- Check password is not URL-encoded in request

### No Test Data
- Check DataLoader logs on startup
- Verify database connection
- Ensure migrations ran successfully

## Development Tips

### Hot Reload
Add Spring Boot DevTools dependency for automatic restart on code changes.

### Debug Mode
```bash
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 \
  -jar target/school-saas-platform-1.0.0.jar
```

### View Logs
```bash
# Tail logs
tail -f logs/school-saas.log

# View SQL queries (set in application.yml)
spring.jpa.show-sql: true
```

### Test with Postman
1. Import OpenAPI spec from http://localhost:8080/api-docs
2. Create environment variable for token
3. Use pre-request script to set Authorization header

## Next Steps

1. ✅ Explore Swagger UI for all endpoints
2. ✅ Test authentication with different roles
3. ✅ Create a school and subscription
4. ✅ Add students, teachers, and courses
5. ✅ Test real-time chat via WebSocket
6. ✅ View dashboard analytics
7. ✅ Check scheduled tasks logs
8. ✅ Review audit logs

## Support

- Check README.md for detailed documentation
- See PROJECT_SUMMARY.md for complete feature list
- Review Swagger UI for API reference

---

**You're all set! Start exploring the platform.**
