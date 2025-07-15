<div align="center">

# 📋 MyTodo - Complete Task Management Ecosystem

**A modern, full-stack task management solution with web, mobile, and API**

[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.80.1-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*Organize your tasks across all devices with a seamless, modern experience*

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🔐 **Complete Authentication System**
- **Secure JWT Authentication** with access and refresh tokens
- **Email Verification** with dual verification methods (link + OTP)
- **Password Reset** functionality via email
- **Account Management** with secure deletion
- **Session Management** with automatic token refresh

### 📝 **Advanced Task Management**
- **Create, Edit, Delete** tasks with intuitive interfaces
- **Priority Levels** (Low, Medium, High) with visual indicators
- **Due Date Tracking** with overdue notifications
- **Task Status Toggle** (Active/Completed)
- **Smart Filtering** and search capabilities
- **Real-time Sync** across all devices

### 🎨 **Modern User Experience**
- **Dark/Light Theme** with system preference detection
- **Responsive Design** for all screen sizes
- **Smooth Animations** and transitions
- **Native Mobile Experience** with gesture support
- **Cross-platform Consistency** between web and mobile

### 🚀 **Performance & Reliability**
- **Fast Loading** with Vite and optimized builds
- **TypeScript** for type safety and better development
- **Efficient State Management** with React Context
- **Offline Support** with local storage sync
- **Comprehensive Error Handling**

---

## 🏗️ Architecture

### **Full-Stack Ecosystem**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile App     │    │   Nginx Proxy   │
│   (React)       │    │ (React Native)  │    │                 │
│                 │    │                 │    │ • SSL/TLS       │
│ • Modern UI/UX  │    │ • Native Design │    │ • Reverse Proxy │
│ • Vite Build    │    │ • TypeScript    │    │ • Static Files  │
│ • PWA Ready     │    │ • Offline Sync  │    │ • Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Server    │
                    │   (Node.js)     │
                    │                 │
                    │ • REST API      │
                    │ • JWT Auth      │
                    │ • Rate Limiting │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │                 │
                    │ • User Data     │
                    │ • Tasks         │
                    │ • Sessions      │
                    └─────────────────┘
```

### **Tech Stack Overview**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Web Client** | React + Vite | 19.1.0 | Modern web interface |
| **Mobile App** | React Native | 0.80.1 | Cross-platform mobile |
| **API Server** | Node.js + Express | 18+ | REST API backend |
| **Database** | PostgreSQL | 12+ | Data persistence |
| **Reverse Proxy** | Nginx | Latest | SSL termination & reverse proxy |
| **Containerization** | Docker + Compose | Latest | Deployment & orchestration |
| **Authentication** | JWT | 9.0+ | Secure auth system |
| **Styling** | CSS Modules + Native | - | Consistent design |

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18 or higher
- **PostgreSQL** 12 or higher
- **Yarn** or **npm**
- **Git**

### **1. Clone the Repository**
```bash
git clone https://github.com/chhedadhruv/myTodo.git
cd myTodo
```

### **2. Set Up the Backend**
```bash
# Navigate to server directory
cd server

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and email settings

# Run database migrations
yarn migrate

# Start development server
yarn dev
```

🎉 **API Server running at** `http://localhost:5000`

### **3. Set Up the Web Client**
```bash
# Open new terminal, navigate to client directory
cd client

# Install dependencies
yarn install

# Start development server
yarn dev
```

🎉 **Web Client running at** `http://localhost:5173`

### **4. Set Up the Mobile App**
```bash
# Open new terminal, navigate to mobile directory
cd mobile

# Install dependencies
yarn install

# iOS Setup (Mac only)
cd ios && pod install && cd ..

# Start Metro bundler
yarn start

# Run on device/simulator
yarn ios     # iOS
yarn android # Android
```

---

## 📱 Platform-Specific Features

### **🌐 Web Client** (`/client`)
- **Modern React 19** with latest features
- **Vite** for lightning-fast development
- **Responsive Design** for all screen sizes
- **PWA Ready** for app-like experience
- **Theme Switching** with system preference detection

### **📱 Mobile App** (`/mobile`)
- **React Native** for native performance
- **TypeScript** for type safety
- **Gesture Support** (swipe to complete/delete)
- **Offline Capability** with local storage
- **Native Date Picker** and UI components

### **🔧 API Server** (`/server`)
- **Express.js** REST API
- **PostgreSQL** database with migrations
- **JWT Authentication** with refresh tokens
- **Email Integration** for verification and reset
- **Rate Limiting** and security features
- **Docker** containerization with multi-stage builds
- **Nginx** reverse proxy with SSL termination

---

## 🔧 Configuration

### **Environment Variables**

<details>
<summary><strong>📄 Server Configuration</strong></summary>

Create `.env` in the `server/` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mytodo
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@mytodo.com

# Client URLs
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

</details>

<details>
<summary><strong>🌐 Client Configuration</strong></summary>

Create `.env` in the `client/` directory:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

</details>

---

## 📚 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/verify-email` - Email verification
- `DELETE /auth/delete-account` - Account deletion

### **Task Endpoints**
- `GET /tasks` - Get all tasks (with filtering)
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/toggle` - Toggle task status

### **Health Check**
- `GET /health` - Server health status

> **📖 Full API Documentation**: See [server/README.md](server/README.md) for complete details

---

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Tasks Table**
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### **Production Deployment**

<details>
<summary><strong>🐳 Docker & Nginx Deployment</strong></summary>

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

</details>

<details>
<summary><strong>🔧 Docker Configuration</strong></summary>

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

<details>
<summary><strong>☁️ Cloud Deployment</strong></summary>

1. **Deploy API Server** to your preferred cloud platform (e.g., VPS, managed container service)
2. **Set up PostgreSQL** database (managed service or self-hosted)
3. **Configure environment variables**
4. **Deploy Web Client** to static hosting (Vercel, Netlify, etc.)
5. **Build Mobile App** for app stores
6. **Set up Nginx** for reverse proxy and SSL termination
7. **(Optional) Use Tailscale** for secure, private networking between your cloud resources (API, database, admin access, etc.)

**Recommended Cloud Setup:**
- **API Server**: Deploy with Docker on your cloud platform
- **Database**: Use managed PostgreSQL service or connect securely via Tailscale
- **Static Files**: Deploy to CDN or static hosting
- **SSL/TLS**: Configure with Let's Encrypt or cloud provider
- **Domain**: Set up custom domain with DNS
- **Tailscale**: Use for secure, private networking between services

</details>

### **Environment Checklist**
- [ ] **Database**: PostgreSQL instance configured (consider Tailscale for secure access)
- [ ] **Environment Variables**: All required vars set
- [ ] **SSL/TLS**: HTTPS certificates configured
- [ ] **Domain**: Custom domain with DNS setup
- [ ] **Email**: SMTP configuration for notifications
- [ ] **CORS**: Frontend URLs added to allowed origins
- [ ] **Nginx**: Reverse proxy and SSL termination configured
- [ ] **Docker**: All services running and healthy
- [ ] **Monitoring**: Logs and health checks configured
- [ ] **Tailscale**: Secure private networking enabled (optional but recommended)

---

## 🛠️ Development

### **Available Scripts**

| Component | Command | Description |
|-----------|---------|-------------|
| **Server** | `yarn dev` | Start with hot reload |
| **Server** | `yarn migrate` | Run database migrations |
| **Web Client** | `yarn dev` | Start Vite dev server |
| **Web Client** | `yarn build` | Build for production |
| **Mobile** | `yarn start` | Start Metro bundler |
| **Mobile** | `yarn ios` | Run on iOS simulator |
| **Mobile** | `yarn android` | Run on Android emulator |

### **Project Structure**
```
myTodo/
├── client/                 # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # CSS styles
│   └── package.json
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── components/     # React Native components
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # Style definitions
│   └── package.json
├── server/                 # Node.js API server
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   └── package.json
└── README.md              # This file
```

---

## 🧪 Testing

### **Running Tests**
```bash
# Server tests (when implemented)
cd server && yarn test

# Mobile tests
cd mobile && yarn test

# Web client tests (when implemented)
cd client && yarn test
```

---

## 🔍 Troubleshooting

<details>
<summary><strong>🔧 Common Issues</strong></summary>

### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify database exists
psql -U postgres -l

# Test connection
psql -U postgres -d mytodo -c "SELECT NOW();"
```

### **Port Conflicts**
```bash
# Check what's using port 5000
lsof -i :5000

# Check what's using port 5173
lsof -i :5173
```

### **Mobile Build Issues**
```bash
# Clean and rebuild
cd mobile
yarn start --reset-cache
```

### **Docker Issues**
```bash
# Check Docker service status
docker-compose ps

# View detailed logs
docker-compose logs -f

# Rebuild specific service
docker-compose up -d --build app

# Clean up Docker resources
docker-compose down -v
docker system prune -f

# Check Nginx configuration
docker-compose exec nginx nginx -t
```

### **Nginx Issues**
```bash
# Check Nginx logs
docker-compose logs nginx

# Test Nginx configuration
docker-compose exec nginx nginx -t

# Reload Nginx configuration
docker-compose exec nginx nginx -s reload

# Check SSL certificate status
docker-compose exec nginx certbot certificates
```

### **Tailscale Issues**
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

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** your changes thoroughly
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to the branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### **Development Guidelines**
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

- **Email**: me@dhruvchheda.com
- **GitHub**: [@chhedadhruv](https://github.com/chhedadhruv)

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **React Native Team** for cross-platform development
- **Vite Team** for the incredible build tool
- **Express.js Team** for the robust web framework
- **Open Source Community** for inspiration and contributions
- **Tailscale** for secure, private networking

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**MyTodo Ecosystem**

[Web Client](client) • [Mobile App](mobile) • [API Server](server)

---

**Happy task managing! 🎯**

[Report Bug](../../issues) • [Request Feature](../../issues) • [Documentation](../../wiki)

</div> 