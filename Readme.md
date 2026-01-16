# Netflix Clone

A full-stack Netflix clone application consisting of a Spring Boot backend and a React/TypeScript frontend. This project replicates core features including user authentication, video streaming, content management, and user ratings.

## Project Overview

This repository contains both the backend API and the frontend user interface.

- **Backend**: RESTful API built with Spring Boot, handling authentication (JWT), data persistence (MySQL), and business logic.
- **Frontend**: Responsive single-page application built with React, TypeScript, and Vite used to interact with the API.

## Technology Stack

### Backend

- Java 25
- Spring Boot 4.0.1
- Spring Security (JWT Authentication)
- Spring Data JPA
- MySQL Database
- JavaMailSender

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS (assumed based on class names)
- Axios

## Features

- **Authentication**: User registration, login, email verification, password reset.
- **User Profiles**: Manage profile details and favorite categories.
- **Video Streaming**: Stream videos with associated posters and details.
- **User Ratings**: 5-star rating system for authenticated users.
- **Watchlist**: Add/remove videos to personal watchlist.
- **Search & Filtering**: Categorize videos and search functionality.
- **Admin Dashboard**: Manage users, upload videos, and oversee content.
- **Role-based Access**: Separate interfaces and permissions for Admin and regular Users.

## Project Structure

```
netflixclone/
│
├── src/                          # Backend Source Code (Spring Boot)
│   ├── main/java/com/arpon007/   # Java Application Code
│   └── main/resources/           # Configuration & Static Resources
│
├── netflix_clone_frontend/       # Frontend Source Code (React)
│   ├── src/                      # React Components, Pages, & Hooks
│   ├── public/                   # Static Assets
│   └── package.json              # Frontend Dependencies
│
├── uploads/                      # Directory for uploaded media (Git ignored typically)
├── pom.xml                       # Backend Dependency Management
└── Readme.md                     # Project Documentation
```

## Setup and Installation

### Prerequisites

- Java JDK 25+
- Node.js 18+ and npm
- MySQL Server

### 1. Database Setup

Create a MySQL database named `netflixdb`.
Update `src/main/resources/application.properties` with your credentials:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Setup

Navigate to the root directory and run the Spring Boot application:

```bash
# Using Maven Wrapper
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd netflix_clone_frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically start on `http://localhost:5173` (check console output).

## Configuration

### Backend (.properties)

Located in `src/main/resources/application.properties`.
Key settings:

- `spring.datasource.*`: Database connection.
- `jwt.secret`: Secret key for token generation.
- `app.cors.allowed-origins`: Frontend URL for CORS.
- `file.upload.*`: Paths for storing video/image files.

### Frontend (.env)

Create a `.env` file in `netflix_clone_frontend/` if strictly necessary, or update `src/utils/axios.ts` or `src/api/` configuration to point to your backend URL (`http://localhost:8080`).

## API Endpoints Overview

### Ratings (New)

- `POST /api/ratings`: Submit a rating for a video.
- `GET /api/ratings/video/{videoId}/stats`: Get average rating and count.
- `GET /api/ratings/video/{videoId}/user`: Get the current user's rating.

### Videos

- `GET /api/videos`: List all videos.
- `POST /api/videos/upload`: Upload new video (Admin only).
- `GET /api/files/video/{uuid}`: Stream video file.

### Auth

- `POST /api/auth/login`: Authenticate user.
- `POST /api/auth/register`: Create new account.

(Refer to Postman collection `Netflix_Clone_Auth_API.postman_collection.json` for full details)

## License

Demonstration Project.

## Author

MD. SHAZAN MAHMUD ARPON
