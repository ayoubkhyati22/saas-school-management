# Deployment Guide

## ⚠️ Important: This is a Java Spring Boot Application

This project requires:
- **Java 17 or higher**
- **Maven 3.9+**
- **PostgreSQL database** (Supabase is pre-configured)

The current deployment environment appears to be Node.js-based and may not support Java applications directly.

---

## Recommended Deployment Options

### Option 1: Docker Deployment (Recommended)

The project includes a complete Docker setup. Deploy using Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

**Platforms that support Docker:**
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Railway (with Docker)
- Render (with Docker)
- Fly.io

### Option 2: Java PaaS Platforms

Deploy to platforms with native Java support:

#### Railway
```bash
# Railway will auto-detect pom.xml
railway up
```

#### Heroku
```bash
heroku create school-saas-platform
git push heroku main
```

#### AWS Elastic Beanstalk
```bash
# Package the application
mvn clean package

# Deploy JAR to Elastic Beanstalk
eb create school-saas-env
```

#### Google App Engine
```yaml
# Create app.yaml
runtime: java17
instance_class: F2
entrypoint: java -jar target/school-saas-platform-1.0.0.jar
```

#### Azure App Service
```bash
az webapp create --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name school-saas-platform \
  --runtime "JAVA:17-java17"

az webapp deploy --resource-group myResourceGroup \
  --name school-saas-platform \
  --src-path target/school-saas-platform-1.0.0.jar
```

### Option 3: Build Locally, Deploy JAR

If your platform accepts pre-built JARs:

```bash
# 1. Build locally
mvn clean package

# 2. Upload target/school-saas-platform-1.0.0.jar to your platform

# 3. Set start command:
java -jar school-saas-platform-1.0.0.jar
```

### Option 4: VPS/Dedicated Server

For full control, deploy to a VPS:

```bash
# 1. Install Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# 2. Install Maven
sudo apt install maven

# 3. Clone and build
git clone <repository-url>
cd school-saas-platform
mvn clean package

# 4. Run as service (systemd)
sudo nano /etc/systemd/system/school-saas.service
```

**Service file:**
```ini
[Unit]
Description=School SaaS Platform
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/school-saas-platform
ExecStart=/usr/bin/java -jar target/school-saas-platform-1.0.0.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable school-saas
sudo systemctl start school-saas
```

---

## Environment Configuration

### Required Environment Variables

```bash
# Database (already configured for Supabase)
DB_PASSWORD=your-supabase-password

# JWT Secret (256+ bits)
JWT_SECRET=your-production-secret-key-here

# Storage Path
STORAGE_PATH=/var/school-saas-storage

# Optional
SERVER_PORT=8080
```

### Supabase Connection (Already Configured)

The application is pre-configured to use Supabase PostgreSQL:
- Host: aws-0-us-east-1.pooler.supabase.com
- Port: 6543
- Database: postgres
- Username: postgres.0ec90b57d6e95fcbda19832f

You only need to set the `DB_PASSWORD` environment variable.

---

## Platform-Specific Instructions

### For Current Environment (Node.js-based)

If your current deployment platform only supports Node.js, you have two options:

#### Option A: Switch to Docker Mode
If your platform supports Docker (most modern platforms do), use the Dockerfile:
- The Dockerfile is already configured
- It will build the Java application inside the container
- No local Java/Maven installation needed

#### Option B: Contact Platform Support
Ask your platform if they support:
- Java 17 applications
- Maven builds
- Custom buildpacks
- Docker deployments

---

## Quick Docker Deployment

### Using Docker Compose (Easiest)

```bash
# Set environment variables
export DB_PASSWORD=your-password
export JWT_SECRET=your-secret

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
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
  -e STORAGE_PATH=/app/storage \
  -v $(pwd)/storage:/app/storage \
  --name school-saas \
  school-saas-platform:latest

# Check logs
docker logs -f school-saas

# Stop container
docker stop school-saas
```

---

## Verifying Deployment

Once deployed, verify the application:

### 1. Health Check
```bash
curl https://your-domain.com/actuator/health
```

### 2. API Documentation
Visit: `https://your-domain.com/swagger-ui.html`

### 3. Login Test
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoolsaas.com",
    "password": "SuperAdmin@123"
  }'
```

---

## Troubleshooting

### "Cannot find Java"
- Your platform doesn't have Java installed
- **Solution**: Use Docker deployment

### "Maven not found"
- Your platform doesn't have Maven installed
- **Solution**: Use Docker deployment

### "Database connection failed"
- Check DB_PASSWORD environment variable
- Verify Supabase is accessible from your platform
- Check firewall/security group settings

### "Port 8080 already in use"
- Set SERVER_PORT environment variable to a different port

---

## Need Help?

If you're unable to deploy using these options:

1. **Check platform documentation** for Java/Spring Boot support
2. **Contact platform support** and ask about Java 17 applications
3. **Use Docker** - Most modern platforms support Docker
4. **Deploy to a Java-friendly platform** - Railway, Heroku, AWS, Azure, GCP

---

## Summary

This is a **Java Spring Boot 3.2** application that requires:
- Java 17+ runtime
- PostgreSQL database (Supabase configured)
- Maven for building (or use Docker)

**Best deployment approach**: Use Docker for maximum compatibility across platforms.

**Dockerfile included**: Yes ✅
**Docker Compose included**: Yes ✅
**Production ready**: Yes ✅
