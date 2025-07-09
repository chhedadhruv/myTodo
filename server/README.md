# MyTodo Server

A Node.js REST API server for the MyTodo application with user authentication and task management.

## Features

- User authentication with JWT tokens
- RESTful API for task management
- PostgreSQL database with proper indexing
- Request validation and sanitization
- Rate limiting and security headers
- Comprehensive error handling
- Pagination and filtering support

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Yarn package manager

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up PostgreSQL database:
```bash
createdb mytodo
```

3. Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mytodo
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

4. Run database migrations:
```bash
yarn migrate
```

5. Start the development server:
```bash
yarn dev
```

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Tasks

All task endpoints require authentication header: `Authorization: Bearer <access_token>`

#### Get All Tasks
```
GET /api/tasks
Query Parameters:
- status: all|active|completed (default: all)
- priority: low|medium|high
- sort: created_at|updated_at|due_date|priority (default: created_at)
- order: asc|desc (default: desc)
- page: number (default: 1)
- limit: number (default: 50, max: 100)
```

#### Get Task by ID
```
GET /api/tasks/:id
```

#### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo application",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59.000Z"
}
```

#### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59.000Z"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
```

#### Toggle Task Status
```
PATCH /api/tasks/:id/toggle
```

### Health Check
```
GET /api/health
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Tasks Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `title` - Task title
- `description` - Task description
- `status` - active|completed
- `priority` - low|medium|high
- `due_date` - Due date timestamp
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Security headers with Helmet.js
- SQL injection protection with parameterized queries

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "details": ["Validation errors array"]
}
```

## Scripts

- `yarn start` - Start production server
- `yarn dev` - Start development server with nodemon
- `yarn migrate` - Run database migrations

## Environment Variables

See the `.env` file setup section above for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request 