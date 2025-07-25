<div align="center">

# 📱 MyTodo Mobile

**A beautiful, cross-platform mobile task management application**

[![React Native](https://img.shields.io/badge/React_Native-0.80.1-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![iOS](https://img.shields.io/badge/iOS-Supported-black?style=for-the-badge&logo=ios)](https://developer.apple.com/ios/)
[![Android](https://img.shields.io/badge/Android-Supported-green?style=for-the-badge&logo=android)](https://developer.android.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*Your productivity companion, now in your pocket*

[Features](#-features) • [Quick Start](#-quick-start) • [Development](#-development) • [Deployment](#-deployment)

</div>

---

## ✨ Features

### 🔐 **Complete Authentication System**
- **Secure Login/Register** with JWT token management
- **Forgot Password** with email recovery
- **Reset Password** functionality
- **Change Password** from settings
- **Biometric Authentication** support (coming soon)

### 📝 **Advanced Task Management**
- **Create & Edit Tasks** with intuitive interface
- **Priority Levels** with visual indicators (High, Medium, Low)
- **Due Date Selection** with native date picker
- **Task Status Management** (Active/Completed)
- **Smart Filtering** and search capabilities
- **Offline Support** with local storage sync

### 🎨 **Modern Mobile Experience**
- **Native iOS & Android** design patterns
- **Dark/Light Theme** with system preference detection
- **Smooth Animations** and haptic feedback
- **Gesture-Based Interactions** (swipe to complete/delete)
- **Responsive Layout** for all screen sizes
- **Custom SVG Icons** for crisp visuals

### 🚀 **Performance & Reliability**
- **TypeScript** for type safety and better development experience
- **Optimized Rendering** with efficient state management
- **Local Data Persistence** with AsyncStorage
- **Error Handling** with user-friendly messages
- **Background Sync** when online

---

## 📱 Screenshots

> *Experience the sleek design and intuitive interface*

<details>
<summary>📸 View App Screenshots</summary>

```
📱 Screenshots Coming Soon:
- Login/Register screens
- Task dashboard
- Task creation flow
- Settings and profile
- Dark/Light theme comparison
- iOS and Android variations
```

</details>

---

## 🛠️ Tech Stack

### **Core Technologies**
- **React Native** 0.80.1 - Cross-platform mobile development
- **TypeScript** 5.0.4 - Type-safe JavaScript
- **React** 19.1.0 - Latest React features

### **Key Libraries**
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API requests
- **React Native SVG** - Scalable vector graphics
- **React Native Date Picker** - Native date selection
- **Context API** - State management for auth and themes

### **Development Tools**
- **ESLint & Prettier** - Code formatting and linting
- **Jest** - Unit testing framework
- **TypeScript Config** - Type checking and compilation
- **Metro** - React Native bundler

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18 or higher
- **React Native CLI** - `npm install -g @react-native-community/cli`
- **Xcode** (for iOS development) - [Mac App Store](https://apps.apple.com/app/xcode/id497799835)
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)
- **CocoaPods** (for iOS) - `sudo gem install cocoapods`

### **1. Clone the Repository**
```bash
git clone https://github.com/chhedadhruv/myTodo.git
cd myTodo/mobile
```

### **2. Install Dependencies**
```bash
# Install dependencies
yarn install
# or
npm install

# iOS Setup (Mac only)
cd ios && pod install && cd ..
```

### **3. Configure API Connection**
Update the API base URL in your components or create a config file:
```typescript
const API_BASE_URL = 'http://localhost:5000/api'; // Development
const API_BASE_URL = 'https://your-api.com/api'; // Production
```

### **4. Start Development**
```bash
# Start Metro bundler
yarn start
# or
npm start
```

### 📱 Run on Device/Simulator

#### iOS (Mac only)
```bash
# Run on iOS Simulator
yarn ios
# or
npm run ios

# Run on specific simulator
yarn ios --simulator="iPhone 15 Pro"

# Run on physical device
yarn ios --device
```

#### Android
```bash
# Run on Android Emulator or connected device
yarn android
# or
npm run android

# Run on specific device
yarn android --deviceId=<device-id>
```

---

## 📖 Usage Guide

### **Getting Started**
1. **Launch the app** on your device or simulator
2. **Register** a new account or **sign in** with existing credentials
3. **Create your first task** using the "+" button
4. **Set priority and due date** for better organization
5. **Swipe gestures** to quickly complete or delete tasks

### **Task Management**
- **📝 Add Task**: Tap the floating action button
- **✏️ Edit Task**: Tap on any task to edit details
- **✅ Complete Task**: Swipe right or tap checkbox
- **🗑️ Delete Task**: Swipe left or use delete option
- **🔍 Search**: Use the search bar to find specific tasks
- **🎯 Filter**: Toggle between All, Active, and Completed tasks

### **Priority System**
- 🔴 **High Priority** - Urgent tasks requiring immediate attention
- 🟡 **Medium Priority** - Important tasks with moderate urgency
- 🟢 **Low Priority** - Tasks that can be completed when convenient

### **Settings & Customization**
- **🌓 Theme Toggle**: Switch between dark and light modes
- **🔒 Change Password**: Update your account security
- **📱 Notifications**: Manage task reminders (coming soon)
- **🔄 Sync**: Manual sync with server

---

## 🛠️ Development

### **Project Structure**
```
src/
├── components/           # React Native components
│   ├── Auth.tsx         # Authentication screens
│   ├── Dashboard.tsx    # Main task dashboard
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   ├── ChangePassword.tsx
│   └── Icons.tsx        # Custom SVG icons
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── styles/              # Style definitions
│   └── variables.ts     # Design tokens
└── types/               # TypeScript type definitions
```

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `yarn start` | Start Metro bundler |
| `yarn ios` | Run on iOS simulator |
| `yarn android` | Run on Android emulator |
| `yarn test` | Run Jest tests |
| `yarn lint` | Run ESLint |

### **Environment Configuration**

For different environments, you can create configuration files:
```typescript
// config/environment.ts
export const config = {
  apiUrl: __DEV__ ? 'http://localhost:5000/api' : 'https://your-api.com/api',
  enableLogging: __DEV__,
};
```

---

## 🔧 Troubleshooting

### **Common Issues & Solutions**

<details>
<summary>🍎 <strong>iOS Issues</strong></summary>

**Pod Install Fails**
```bash
cd ios
pod deintegrate
pod install
```

**Build Errors**
```bash
# Clean build folder
yarn ios --reset-cache
# or
cd ios && xcodebuild clean && cd ..
```

**Simulator Issues**
```bash
# Reset simulator
npx react-native run-ios --reset-cache
```

</details>

<details>
<summary>🤖 <strong>Android Issues</strong></summary>

**Gradle Build Fails**
```bash
cd android
./gradlew clean
cd ..
yarn android
```

**ADB Issues**
```bash
adb kill-server
adb start-server
```

**Metro Cache Issues**
```bash
npx react-native start --reset-cache
```

</details>

<details>
<summary>⚡ <strong>General Issues</strong></summary>

**Node Modules Issues**
```bash
rm -rf node_modules
yarn install
# or
npm install
```

**Cache Issues**
```bash
npx react-native start --reset-cache
```

**TypeScript Errors**
```bash
# Check types
npx tsc --noEmit
```

</details>

---

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run tests in watch mode
yarn test --watch

# Run specific test file
yarn test Auth.test.tsx
```

---

## 🚀 Deployment

### **📱 App Store Deployment**

The mobile app is designed to be deployed to the official app stores for distribution.

#### **iOS App Store**
```bash
# 1. Archive in Xcode
# 2. Upload to App Store Connect
# 3. Submit for review

# Or via command line
npx react-native run-ios --configuration Release
```

#### **Android Play Store**
```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Generate signed AAB (recommended for Play Store)
./gradlew bundleRelease
```

### **🔧 Production Configuration**

Before deploying to app stores:

1. **Update API Configuration** to point to your production server
2. **Configure App Icons** and splash screens
3. **Set up Code Signing** for both platforms
4. **Test on Physical Devices** before submission
5. **Configure App Store Metadata** (descriptions, screenshots, etc.)

### **🌐 API Server Requirements**

Ensure your API server is deployed and accessible:
- **Production API URL** configured in the app
- **SSL/TLS** enabled for secure communication
- **CORS** configured to allow mobile app requests
- **Rate Limiting** and security measures in place

> **📖 API Documentation**: See [server/README.md](../server/README.md) for complete API setup and deployment details.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`yarn test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dhruv Chheda**

- **Email**: me@dhruvchheda.com
- **GitHub**: [@chhedadhruv](https://github.com/chhedadhruv)

---

## 🙏 Acknowledgments

- **React Native Team** for cross-platform mobile development
- **TypeScript Team** for type safety and better development experience
- **React Team** for the amazing framework

---

## 🔗 Related Projects

**MyTodo Ecosystem**

[Web Client](../client) • **Mobile App** (You are here) • [API Server](../server)

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ using React Native**

*Happy task managing! 🎯*

</div>
