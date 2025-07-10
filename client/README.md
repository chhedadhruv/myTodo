# 📋 MyTodo - Modern Task Management

<div align="center">
  <h3>🎯 Organize Your Tasks, Amplify Your Productivity</h3>
  <p>A modern, intuitive task management web application built with React and powered by cutting-edge technologies.</p>
  
  ![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-7.0.3-646CFF?style=for-the-badge&logo=vite)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
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

## 🖼️ Screenshots

> *Screenshots showcase the application's clean interface and feature set*

<details>
<summary>Click to view screenshots</summary>

```
📱 Coming Soon: Add screenshots here
- Login/Register screens
- Dashboard with tasks
- Task creation modal
- Dark/Light theme comparison
- Mobile responsive views
```

</details>

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

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chhedadhruv/myTodo.git
   cd myTodo/client
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using yarn
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

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

The application connects to a REST API backend. Make sure your backend server is running on `http://localhost:3001` or update the API base URL in the code.

### **Required API Endpoints**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/tasks` - Fetch user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

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
VITE_API_BASE_URL=http://localhost:3001/api
```

### **Contributing**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📱 Mobile App

This project also includes a React Native mobile application! Check out the `mobile/` directory for the companion mobile app.

---

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/chhedadhruv/myTodo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chhedadhruv/myTodo/discussions)
- **Email**: me@dhruvchheda.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the incredible build tool
- **Lucide** for the beautiful icons
- **Open Source Community** for inspiration and contributions

---

<div align="center">
  <h3>🌟 Star this repository if you found it helpful!</h3>
  <p>Built with ❤️ by [Your Name]</p>
</div>
