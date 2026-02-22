# School Management System - Flutter App

A modern Flutter mobile application for school management with a clean Material Design 3 interface.

## Features

### 🔐 Authentication
- Email/password login with form validation
- Token-based authentication with Bearer tokens
- Secure API communication

### 📚 Student Dashboard
- **Home Tab**: Welcome banner, course count stats, and motivational quotes
- **Courses Tab**: View all enrolled courses with shimmer loading effects
- **Profile Tab**: User information and logout functionality

### 🎨 Design
- Material Design 3
- Deep Blue (#1565C0) primary color scheme
- Gradient backgrounds
- Card-based UI with 16px rounded corners
- Smooth animations and transitions
- Google Fonts (Poppins)
- Color-coded course cards

## Tech Stack

- **Framework**: Flutter 3.0+
- **HTTP Client**: http ^1.2.0
- **Fonts**: google_fonts ^6.1.0
- **Loading Effects**: shimmer ^3.0.0
- **State Management**: StatefulWidget with setState

## API Integration

Base URL: `http://localhost:8080`

### Endpoints Used:
1. **POST** `/api/auth/login` - User authentication
2. **GET** `/api/auth/me` - Get current user info
3. **GET** `/api/students/{studentId}` - Get student details
4. **GET** `/api/courses/classroom/{classRoomId}` - Get classroom courses

## Project Structure

```
lib/
├── main.dart                    # App entry point
├── models/                      # Data models
│   ├── login_response.dart
│   ├── user_dto.dart
│   ├── student_detail_dto.dart
│   └── course_dto.dart
├── services/                    # API services
│   └── api_service.dart
├── screens/                     # Main screens
│   ├── login_screen.dart
│   └── dashboard_screen.dart
└── widgets/                     # Tab widgets
    ├── home_tab.dart
    ├── courses_tab.dart
    └── profile_tab.dart
```

## Getting Started

### Prerequisites
- Flutter SDK 3.0 or higher
- Dart SDK
- Android Studio / VS Code with Flutter extensions
- Running backend API at `http://localhost:8080`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the app:
   ```bash
   flutter run
   ```

### Test Credentials

- **Email**: `alice.student@greenvalley.edu`
- **Password**: `Student@123`

## Features Breakdown

### Login Screen
- Gradient background (light blue to white)
- Email and password fields with validation
- Show/hide password toggle
- Loading spinner during authentication
- Error handling with SnackBar notifications

### Dashboard
- Persistent top AppBar with user greeting and avatar
- Bottom navigation with 3 tabs (Home, Courses, Profile)
- Default tab: Courses

### Home Tab
- Welcome banner with gradient background
- Quick stats cards showing course count and semester
- Motivational quote card

### Courses Tab
- Header with title and subtitle
- Shimmer loading effect while fetching data
- Course cards with:
  - Colored left border accent (cycles through 5 colors)
  - Subject name and code
  - Teacher name with icon
  - Schedule with clock icon
  - Speciality badge
- Error state with retry button
- Empty state for no courses

### Profile Tab
- Large avatar circle with user initials
- Full name and email display
- Info cards for School ID, Role, and Status
- Logout button (returns to login screen)

## API Response Handling

All API calls include:
- Try-catch error handling
- Loading states
- Error messages displayed to user
- Proper HTTP headers (Content-Type, Authorization)

## Color Palette

Course card accent colors cycle through:
1. Blue: #1565C0
2. Green: #2E7D32
3. Purple: #6A1B9A
4. Orange: #E65100
5. Teal: #00838F

## Notes

- All user data is stored in memory (no persistent storage)
- Logout clears the session and returns to login screen
- All API calls require Bearer token authentication
- Loading states use shimmer effects for better UX
- Error states include retry functionality
