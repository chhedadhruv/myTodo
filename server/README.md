<div align="center">

# 🚀 MyTodo Server

**A modern, secure REST API server for the MyTodo application**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Built with Node.js, Express, and PostgreSQL*

[Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [🔧 Configuration](#-configuration)
- [📚 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [🛡️ Security Features](#️-security-features)
- [🐳 Docker Deployment](#-docker-deployment)
- [🚀 Production Deployment](#-production-deployment)
- [📈 Monitoring & Health Checks](#-monitoring--health-checks)
- [🔍 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

<details>
<summary>🔐 <strong>Authentication & Security</strong></summary>

- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcrypt (12 salt rounds)
- Email verification system with dual verification methods (link + OTP)
- Email-based password reset functionality
- Secure account deletion with confirmation
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection with configurable origins
- Comprehensive input validation and sanitization
- Security headers via Helmet.js

</details>

<details>
<summary>📝 <strong>Task Management</strong></summary>

- Complete CRUD operations for tasks
- Advanced filtering by status, priority, and date
- Pagination support with customizable limits
- Task status toggling (active ↔ completed)
- Due date management with validation
- Priority levels (low, medium, high)

</details>

<details>
<summary>🚀 <strong>Developer Experience</strong></summary>

- Hot reload development with Nodemon
- Docker and Docker Compose ready
- Comprehensive error handling
- Built-in health check endpoints
- Structured logging
- Database migrations

</details>

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 4.18+ |
| **Database** | PostgreSQL | 12+ |
| **Authentication** | JWT | 9.0+ |
| **Security** | Helmet, bcrypt, rate-limit | Latest |
| **Validation** | express-validator | 7.0+ |
| **Email** | Nodemailer | 7.0+ |
| **Development** | Nodemon | 3.0+ |

---

## 📋 Prerequisites

> **Before you begin, ensure you have the following installed:**

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 12 or higher ([Download](https://postgresql.org/download/))
- **Yarn** or **npm** package manager
- **Git** for version control

---

## 🚀 Quick Start

### 🔥 Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd server

# 2. Install dependencies
yarn install

# 3. Set up PostgreSQL database
createdb mytodo

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your configurations

# 5. Run database migrations
yarn migrate

# 6. Start development server
yarn dev
```

🎉 **Server will be running at** `http://localhost:5000`

### ⚡ Quick Test

```bash
# Test the health endpoint
curl http://localhost:5000/api/health
```

---

## 🔧 Configuration

Create a `.env` file in the server directory:

<details>
<summary>📄 <strong>Complete Environment Configuration</strong></summary>

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mytodo
DB_USER=postgres
DB_PASSWORD=your_secure_password_here

# JWT Configuration (Use strong, unique secrets in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-change-this-in-production-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for password reset and email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@mytodo.com

# Client URL (for email verification links)
CLIENT_URL=http://localhost:5173

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Optional: Redis Configuration (for future use)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Optional: Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

</details>

> **⚠️ Security Note:** Always use strong, unique secrets in production and never commit `.env` files to version control!

---

## 📧 Email Verification Setup

### 🔧 Gmail Configuration

If you're using Gmail for sending emails, you'll need to set up an App Password:

1. **Enable 2-Factor Authentication** on your Google account
2. Go to **Google Account Settings** > **Security** > **App passwords**
3. Generate an app password for "Mail"
4. Use this app password in `SMTP_PASS` (not your regular Gmail password)

### 🚀 Email Features

- **Registration Flow**: New users receive verification emails with both link and OTP options
- **Login Protection**: Unverified users cannot log in until email is verified
- **Dual Verification**: Users can verify via email link OR 6-digit OTP code
- **Account Deletion**: Secure deletion with email confirmation

### 📋 For Existing Users

If you have existing users in your database:
1. All existing users will have `email_verified = FALSE` after running migrations
2. These users will need to verify their emails to log in
3. You can manually verify trusted users:
   ```sql
   UPDATE users SET email_verified = TRUE WHERE email = 'trusted@example.com';
   ```

---

## 📚 API Documentation

### 🏠 Base URL
```
http://localhost:5000/api
```

### 🔐 Authentication Endpoints

<details>
<summary><strong>POST</strong> <code>/api/auth/register</code> - Register new user</summary>

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "emailVerified": false
  },
  "requiresVerification": true
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/login</code> - User login</summary>

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "emailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (Unverified Email):**
```json
{
  "error": "Email not verified. Please verify your email before logging in.",
  "requiresVerification": true,
  "email": "john@example.com"
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/refresh</code> - Refresh access token</summary>

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

</details>

<details>
<summary><strong>GET</strong> <code>/api/auth/me</code> - Get current user</summary>

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/forgot-password</code> - Request password reset</summary>

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/verify-email</code> - Verify email with token</summary>

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

**Response:**
```json
{
  "message": "Email verified successfully! You can now use all features of MyTodo.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "emailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/verify-otp</code> - Verify email with OTP</summary>

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully! You can now use all features of MyTodo.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "emailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/resend-verification</code> - Resend verification email</summary>

```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent successfully. Please check your email."
}
```

</details>

<details>
<summary><strong>DELETE</strong> <code>/api/auth/delete-account</code> - Delete user account</summary>

```http
DELETE /api/auth/delete-account
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "password": "SecurePass123",
  "confirmDelete": "DELETE"
}
```

**Response:**
```json
{
  "message": "Account deleted successfully. We're sorry to see you go!"
}
```

</details>

### 📝 Task Endpoints

> **All task endpoints require authentication:** `Authorization: Bearer <access_token>`

<details>
<summary><strong>GET</strong> <code>/api/tasks</code> - Get all tasks with filtering</summary>

```http
GET /api/tasks?status=all&priority=high&sort=created_at&order=desc&page=1&limit=50
```

**Query Parameters:**
| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `status` | `all`, `active`, `completed` | `all` | Filter by task status |
| `priority` | `low`, `medium`, `high` | - | Filter by priority |
| `sort` | `created_at`, `updated_at`, `due_date`, `priority` | `created_at` | Sort field |
| `order` | `asc`, `desc` | `desc` | Sort order |
| `page` | number | `1` | Page number |
| `limit` | number (max 100) | `50` | Items per page |

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the todo application",
      "status": "active",
      "priority": "high",
      "due_date": "2024-12-31T23:59:59.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "pages": 1
  }
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/tasks</code> - Create new task</summary>

```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Complete project",
  "description": "Finish the todo application",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59.000Z"
}
```

</details>

<details>
<summary><strong>GET</strong> <code>/api/tasks/:id</code> - Get task by ID</summary>

```http
GET /api/tasks/1
Authorization: Bearer <access_token>
```

</details>

<details>
<summary><strong>PUT</strong> <code>/api/tasks/:id</code> - Update task</summary>

```http
PUT /api/tasks/1
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Updated title",
  "description": "Updated description", 
  "status": "completed",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59.000Z"
}
```

</details>

<details>
<summary><strong>DELETE</strong> <code>/api/tasks/:id</code> - Delete task</summary>

```http
DELETE /api/tasks/1
Authorization: Bearer <access_token>
```

</details>

<details>
<summary><strong>PATCH</strong> <code>/api/tasks/:id/toggle</code> - Toggle task status</summary>

```http
PATCH /api/tasks/1/toggle
Authorization: Bearer <access_token>
```

</details>

### 🏥 Health Check

<details>
<summary><strong>GET</strong> <code>/api/health</code> - Server health status</summary>

```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

</details>

---

## 🗄️ Database Schema

### 👥 Users Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `username` | VARCHAR(30) | UNIQUE, NOT NULL | Username |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

### ✅ Tasks Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique task identifier |
| `user_id` | INTEGER | FOREIGN KEY, NOT NULL | Task owner |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `description` | TEXT | | Task description |
| `status` | VARCHAR(20) | DEFAULT 'active' | `active` or `completed` |
| `priority` | VARCHAR(20) | DEFAULT 'medium' | `low`, `medium`, or `high` |
| `due_date` | TIMESTAMP | | Task due date |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Task creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

---

## 🛡️ Security Features

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Password Security** | bcrypt with 12 salt rounds | Industry-standard password hashing |
| **JWT Authentication** | Access + Refresh tokens | Secure token-based authentication |
| **Input Validation** | express-validator | Comprehensive request validation |
| **Rate Limiting** | 100 req/15min per IP | DDoS and abuse protection |
| **CORS Protection** | Configurable origins | Cross-origin request security |
| **Security Headers** | Helmet.js | Essential security headers |
| **SQL Injection Protection** | Parameterized queries | Database security |

---

## 🐳 Docker Deployment

### 🚀 Quick Docker Setup

```bash
# Start all services (includes PostgreSQL, Redis, nginx)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

### 📊 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `app` | 5000 | MyTodo Server |
| `postgres` | 5432 | PostgreSQL Database |
| `redis` | 6379 | Redis Cache (optional) |
| `nginx` | 80/443 | Reverse Proxy (optional) |

### 🔧 Docker Configuration

<details>
<summary><strong>Custom Docker Environment</strong></summary>

Create a `.env` file for Docker Compose:

```bash
# Database
DB_PASSWORD=your_secure_database_password

# JWT Secrets
JWT_SECRET=your-production-jwt-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-production-refresh-secret-minimum-32-characters

# Email Configuration
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

</details>

---

## 🚀 Production Deployment

### 🐳 Docker & Nginx Deployment

The project includes a complete Docker setup with Nginx reverse proxy for production deployment.

```bash
# Navigate to server directory
cd server

# Build and start all services with Docker Compose
docker-compose up -d --build

# Check status of all services
docker-compose ps

# View logs for specific service
docker-compose logs -f app      # API server logs
docker-compose logs -f nginx    # Nginx logs
docker-compose logs -f postgres # Database logs

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build --force-recreate
```

**Docker Services:**
- **`app`** - Node.js API server (port 5000)
- **`postgres`** - PostgreSQL database (port 5432)
- **`nginx`** - Reverse proxy and SSL termination (port 80/443)
- **`redis`** - Optional caching layer (port 6379)

**Nginx Configuration:**
- SSL/TLS termination with automatic certificate management
- Reverse proxy to Node.js application
- Static file serving for optimized performance
- Security headers and rate limiting
- Gzip compression for faster responses

### ☁️ Cloud Platform Deployment

For cloud platform deployment (VPS, managed container service, etc.):

1. **Deploy API Server** to your preferred cloud platform
2. **Set up PostgreSQL** database (managed service recommended)
3. **Configure environment variables**
4. **Set up Nginx** for reverse proxy and SSL termination
5. **Configure monitoring** and health checks

**Recommended Cloud Setup:**
- **API Server**: Deploy with Docker on your cloud platform
- **Database**: Use managed PostgreSQL service or connect securely via Tailscale
- **SSL/TLS**: Configure with Let's Encrypt or cloud provider
- **Domain**: Set up custom domain with DNS
- **Tailscale**: Use for secure, private networking between services (optional)

### 🔧 Docker Configuration

<details>
<summary><strong>Production Docker Environment</strong></summary>

Create a `.env` file for Docker Compose:

```bash
# Database Configuration
DB_PASSWORD=your_secure_database_password
POSTGRES_DB=mytodo
POSTGRES_USER=postgres

# JWT Secrets (Use strong, unique secrets in production!)
JWT_SECRET=your-production-jwt-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-production-refresh-secret-minimum-32-characters

# Email Configuration
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com

# Nginx Configuration
NGINX_HOST=yourdomain.com
NGINX_SSL_EMAIL=your-email@domain.com
```

**Docker Compose Features:**
- **Multi-stage builds** for optimized images
- **Volume persistence** for database and logs
- **Health checks** for all services
- **Automatic restarts** on failure
- **Network isolation** for security

</details>

### ☁️ Cloud Deployment Checklist

- [ ] **Environment Variables**: Set all required env vars
- [ ] **Database**: Use managed PostgreSQL service (consider Tailscale for secure access)
- [ ] **SSL/TLS**: Configure HTTPS with valid certificates
- [ ] **Domain**: Set up custom domain with DNS
- [ ] **Monitoring**: Configure logging and alerting
- [ ] **Backups**: Set up automated database backups
- [ ] **Nginx**: Reverse proxy and SSL termination configured
- [ ] **Docker**: All services running and healthy
- [ ] **Tailscale**: Secure private networking enabled (optional but recommended)

### 🔧 Nginx Configuration

The included `nginx.conf` provides:
- SSL/TLS termination
- Static file serving
- Reverse proxy to Node.js app
- Security headers
- Rate limiting

---

## 📈 Monitoring & Health Checks

### 🏥 Health Endpoints

```bash
# Basic health check
curl http://localhost:5000/api/health

# Docker health check
docker-compose ps
```

### 📊 Logging

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# All services
docker-compose logs -f
```

### 📈 Metrics to Monitor

- **Response Times**: API endpoint performance
- **Error Rates**: 4xx/5xx response codes
- **Database Connections**: Connection pool usage
- **Memory Usage**: Node.js heap usage
- **CPU Usage**: Server resource utilization

---

## 🔍 Troubleshooting

<details>
<summary>🔧 <strong>Common Issues</strong></summary>

### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Verify database exists
docker-compose exec postgres psql -U postgres -l

# Test connection
docker-compose exec app node -e "
const pool = require('./config/database.js');
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  process.exit();
});
"
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set and consistent
- Check token expiration times
- Verify token format in Authorization header

### CORS Issues
- Check `CORS_ORIGIN` environment variable
- Verify frontend URL matches CORS configuration
- Check browser developer tools for CORS errors

### Email Issues
- Verify SMTP credentials
- Check if less secure app access is enabled (Gmail)
- Test email configuration with a simple send

### Tailscale Issues
```bash
# Check Tailscale status
tailscale status

# Restart Tailscale service
sudo tailscale up

# Check your node's IP and connectivity
tailscale ip -4
tailscale ping <other-node>

# For database or admin access, ensure both nodes are in the same Tailscale network
```

</details>

<details>
<summary>🐛 <strong>Debug Mode</strong></summary>

```bash
# Enable debug logging
NODE_ENV=development yarn dev

# Run with more verbose logging
DEBUG=express:* yarn dev

# Database query logging
LOG_LEVEL=debug yarn dev
```

</details>

---

## 🔄 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `yarn dev` | Start with hot reload |
| **Production** | `yarn start` | Start production server |
| **Database** | `yarn migrate` | Run database migrations |
| **Docker** | `docker-compose up -d` | Start all services |
| **Logs** | `docker-compose logs -f` | View container logs |

---

## 📝 Error Handling

All API responses follow a consistent error format:

```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict (duplicate) |
| `429` | Rate Limit Exceeded |
| `500` | Internal Server Error |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### 📝 Development Guidelines

- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dhruv Chheda**

---

## 🙏 Acknowledgments

- **Express.js Team** for the robust web framework
- **PostgreSQL Team** for the reliable database
- **Docker Team** for containerization technology
- **Nginx Team** for the high-performance web server
- **Tailscale** for secure, private networking

---

<div align="center">

### 🌟 Related Projects

**MyTodo Ecosystem**

[Web Client](../client) • [Mobile App](../mobile) • **Server** (You are here)

---

**⭐ Star this repository if you found it helpful!**

</div> 