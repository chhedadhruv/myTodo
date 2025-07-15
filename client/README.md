<div align="center">

# 🌐 MyTodo Web Client

**A modern, responsive web application for task management**

[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*Organize your tasks with a beautiful, modern web interface*

[Features](#-features) • [Quick Start](#-quick-start) • [Development](#-development) • [Deployment](#-deployment)

</div>

---

## ✨ Features

### 🔐 **Authentication System**
- **Secure Login/Register** with JWT authentication
- **Password Reset** functionality via email
- **Session Management** with automatic token refresh
- **Password Change** from user profile

### 📝 **Task Management**
- **Create, Edit, Delete** tasks with ease
- **Priority Levels** (Low, Medium, High) with color coding
- **Due Date Tracking** with overdue indicators
- **Task Status Toggle** (Complete/Incomplete)
- **Smart Filtering** (All, Active, Completed tasks)

### 🎨 **Modern UI/UX**
- **Dark/Light Theme** toggle with system preference detection
- **Responsive Design** for all screen sizes
- **Smooth Animations** and transitions
- **Intuitive Icons** powered by Lucide React
- **Clean, Minimalist** interface

### 🚀 **Performance**
- **Fast Loading** with Vite's lightning-fast dev server
- **Optimized Builds** with code splitting
- **Efficient State Management** with React Context
- **API Integration** with error handling and loading states

---



---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Latest version with concurrent features
- **Vite** - Next-generation frontend tooling
- **React Router DOM** - Client-side routing
- **Axios** - Promise-based HTTP client
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation library

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Vite DevServer** - Hot module replacement
- **React DevTools** - Component debugging

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18 or higher
- **Yarn** or **npm**
- **Git**

### **1. Clone the Repository**
```bash
git clone https://github.com/chhedadhruv/myTodo.git
cd myTodo/client
```

### **2. Install Dependencies**
```bash
# Using yarn
yarn install

# Using npm
npm install
```

### **3. Configure API Connection**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### **4. Start Development**
```bash
# Using yarn
yarn dev

# Using npm
npm run dev
```

🎉 **Web Client running at** `http://localhost:5173`

### 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 📖 Usage Guide

### **Getting Started**
1. **Register** a new account or **login** with existing credentials
2. **Create your first task** using the "+" button
3. **Set priority** and **due date** for better organization
4. **Toggle theme** using the theme switcher in the top right
5. **Filter tasks** by status (All, Active, Completed)

### **Task Management**
- **Add Task**: Click the "+" icon and fill in task details
- **Edit Task**: Click the edit icon on any task
- **Complete Task**: Click the checkbox to mark as complete
- **Delete Task**: Use the trash icon to remove tasks
- **Priority Colors**: 
  - 🔴 High Priority
  - 🟡 Medium Priority  
  - 🟢 Low Priority

### **Profile Management**
- **Change Password**: Access via profile dropdown
- **Theme Toggle**: Switch between dark/light modes
- **Logout**: Securely end your session

---

## 🔌 API Integration

The web client connects to the MyTodo REST API backend. Ensure your API server is running and accessible.

### **API Configuration**
Update the API base URL in your `.env` file:
```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api

# Production
VITE_API_BASE_URL=https://your-api.com/api
```

### **Required API Endpoints**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/tasks` - Fetch user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

> **📖 Full API Documentation**: See [server/README.md](../server/README.md) for complete API details.

---

## 🔧 Development

### **Project Structure**
```
src/
├── components/          # React components
│   ├── Auth.jsx        # Authentication component
│   ├── Dashboard.jsx   # Main dashboard
│   └── *.css          # Component styles
├── contexts/           # React context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme management
├── styles/             # Global styles
│   └── variables.css   # CSS variables
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

### **Environment Configuration**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

### **🌐 Static Hosting Deployment**

The web client is designed to be deployed as a static application to various hosting platforms.

#### **Build for Production**
```bash
# Create production build
yarn build
# or
npm run build

# Preview production build locally
yarn preview
# or
npm run preview
```

#### **Deploy to Platforms**
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Cloudflare Pages**: Connect repository for automatic builds

### **🔧 Production Configuration**

Before deploying:

1. **Update API URL** to point to your production server
2. **Configure Environment Variables** for production
3. **Test the Build** locally with `yarn preview`
4. **Set up Custom Domain** (optional)
5. **Configure SSL/TLS** (usually automatic with modern platforms)

### **🌐 API Server Requirements**

Ensure your API server is deployed and accessible:
- **Production API URL** configured in the app
- **SSL/TLS** enabled for secure communication
- **CORS** configured to allow web client requests
- **Rate Limiting** and security measures in place

> **📖 API Documentation**: See [server/README.md](../server/README.md) for complete API setup and deployment details.

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

## 👨‍💻 Author

**Dhruv Chheda**

- **Email**: me@dhruvchheda.com
- **GitHub**: [@chhedadhruv](https://github.com/chhedadhruv)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the incredible build tool
- **Lucide** for the beautiful icons
- **Open Source Community** for inspiration and contributions

---

## 🔗 Related Projects

**MyTodo Ecosystem**

**Web Client** (You are here) • [Mobile App](../mobile) • [API Server](../server)

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ using React & Vite**

*Happy task managing! 🎯*

</div>
