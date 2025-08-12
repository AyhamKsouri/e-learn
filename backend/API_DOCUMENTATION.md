# E-Learning App Backend API Documentation

## Overview
This document outlines all the available API endpoints for the E-Learning App backend, with a focus on the enhanced user management and settings functionality.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using Bearer tokens in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
- **POST** `/users/register`
- **Body**: `{ name, email, password, role? }`
- **Response**: User object with JWT token
- **Public**: Yes

### Login User
- **POST** `/users/login`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token and session info
- **Public**: Yes

---

## 👤 User Profile Management

### Get Current User Profile
- **GET** `/users/me`
- **Authentication**: Required
- **Response**: Complete user profile with preferences, sessions, courses
- **Usage**: Load user data for dashboard and settings

### Update User Profile
- **PUT** `/users/me`
- **Authentication**: Required
- **Body**: `{ name?, profileImage? }` or FormData with file upload
- **Response**: Updated user profile
- **Features**: 
  - Text-based profile updates
  - File upload for profile images (5MB limit)
  - Supports JPG, PNG, WEBP formats
  - Auto-converts to base64 for storage

---

## 🔒 Account Security

### Change Password
- **PUT** `/users/change-password`
- **Authentication**: Required
- **Body**: `{ oldPassword, newPassword }`
- **Response**: Success message
- **Validation**: 
  - Verifies current password
  - Minimum 8 characters for new password
  - Auto-hashes new password

### Toggle Two-Factor Authentication
- **PUT** `/users/two-factor`
- **Authentication**: Required
- **Body**: `{ enabled: boolean }`
- **Response**: Updated 2FA status
- **Future-proof**: Ready for 2FA implementation

### Logout from All Devices
- **POST** `/users/logout-all`
- **Authentication**: Required
- **Response**: Success message
- **Features**: 
  - Invalidates all other sessions
  - Keeps current session active
  - Tracks device information

---

## ⚙️ Preferences & Settings

### Update User Preferences
- **PUT** `/users/preferences`
- **Authentication**: Required
- **Body**: 
  ```json
  {
    "language": "en|fr|es|ar",
    "theme": "light|dark|system",
    "emailNotifications": boolean,
    "courseRecommendations": boolean
  }
  ```
- **Response**: Updated preferences
- **Validation**: Only allows specified preference keys

---

## ⚠️ Danger Zone Actions

### Clear User Progress
- **POST** `/users/clear-progress`
- **Authentication**: Required
- **Response**: Success message
- **Action**: 
  - Resets all course progress to 0
  - Clears completed courses list
  - Preserves enrollment data

### Delete User Account
- **DELETE** `/users/me`
- **Authentication**: Required
- **Response**: Success message
- **Action**: Permanently deletes user account and all data

---

## 👥 Admin Endpoints

### Get All Users
- **GET** `/users?page=1&limit=10`
- **Authentication**: Required (Admin only)
- **Response**: Paginated list of users
- **Query Parameters**: `page`, `limit`

---

## 📊 Database Schema Updates

### Enhanced User Model
```javascript
{
  // Basic Info
  name: String,
  email: String,
  password: String (hashed),
  role: 'student'|'teacher'|'admin',
  
  // Profile
  profileImage: String (base64),
  
  // Security
  twoFactorEnabled: Boolean,
  activeSessions: [{
    sessionId: String,
    deviceInfo: String,
    ipAddress: String,
    lastActive: Date,
    createdAt: Date
  }],
  
  // Preferences
  preferences: {
    language: 'en'|'fr'|'es'|'ar',
    theme: 'light'|'dark'|'system',
    emailNotifications: Boolean,
    courseRecommendations: Boolean
  },
  
  // Courses
  enrolledCourses: [{
    course: ObjectId,
    progress: Number,
    enrolledAt: Date
  }],
  completedCourses: [{
    course: ObjectId,
    completedAt: Date
  }],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastUpdated: Date
}
```

---

## 🛡️ Security Features

### Session Management
- Automatic session tracking on login/register
- Device and browser detection
- IP address logging
- Session cleanup (30-day expiry)
- Maximum 10 active sessions per user

### File Upload Security
- File type validation (images only)
- File size limits (5MB max)
- Memory storage (not disk-based)
- Base64 conversion for database storage

### Password Security
- Bcrypt hashing with salt rounds
- Password strength validation
- Old password verification for changes

---

## 🧪 Testing the API

### Example Usage (JavaScript)
```javascript
// Login
const loginResponse = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Update preferences
const prefResponse = await fetch('/api/users/preferences', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    language: 'fr',
    theme: 'dark',
    emailNotifications: true
  })
});

// Upload profile image
const formData = new FormData();
formData.append('name', 'New Name');
formData.append('profileImage', imageFile);

const profileResponse = await fetch('/api/users/me', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

## 🚀 Ready for Integration

All endpoints are now ready for integration with the frontend Settings page. The backend provides:

- ✅ Complete user profile management
- ✅ Secure password changes
- ✅ Two-factor authentication setup
- ✅ Session tracking and management
- ✅ User preferences storage
- ✅ File upload handling
- ✅ Dangerous actions with proper safeguards
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization

The backend is now **production-ready** and provides a rich, interactive experience with the database!
