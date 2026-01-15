# Netflix Clone - Backend API

A full-featured Netflix clone backend application built with Spring Boot, providing authentication, user management, and video streaming capabilities.

## Project Overview

This is a RESTful API backend for a Netflix-like streaming platform. It includes user authentication with JWT, email verification, password management, and video handling features.

## Technology Stack

- Java 25
- Spring Boot 4.0.1
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT (JSON Web Tokens) for authentication
- JavaMailSender for email services
- Maven for dependency management

## Features

- User Registration and Authentication
- JWT-based Authorization
- Email Verification System
- Password Reset Functionality
- User Profile Management
- Video Upload and Management
- Role-based Access Control
- CORS Configuration for Frontend Integration
- Global Exception Handling

## Project Structure

```
netflixclone/
│
├── src/
│   ├── main/
│   │   ├── java/com/arpon007/netflixclone/
│   │   │   ├── NetflixcloneApplication.java          # Main application entry point
│   │   │   │
│   │   │   ├── config/                               # Configuration classes
│   │   │   │   ├── CorsConfig.java                   # CORS configuration
│   │   │   │   └── SecurityConfig.java               # Security and authentication configuration
│   │   │   │
│   │   │   ├── controller/                           # REST API Controllers
│   │   │   │   └── AuthController.java               # Authentication endpoints
│   │   │   │
│   │   │   ├── dao/                                  # Data Access Objects (Repositories)
│   │   │   │   ├── UserRepository.java               # User database operations
│   │   │   │   └── VideoRepository.java              # Video database operations
│   │   │   │
│   │   │   ├── DTO/                                  # Data Transfer Objects
│   │   │   │   ├── request/                          # Request DTOs
│   │   │   │   │   ├── ChangePasswordRequest.java
│   │   │   │   │   ├── EmailRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── ResetPassword.java
│   │   │   │   │   ├── UserRequest.java
│   │   │   │   │   └── VideoRequest.java
│   │   │   │   │
│   │   │   │   └── response/                         # Response DTOs
│   │   │   │       ├── EmailValidationResponse.java
│   │   │   │       ├── LoginResponse.java
│   │   │   │       ├── MessageResponse.java
│   │   │   │       ├── PageResponse.java
│   │   │   │       ├── UserResponse.java
│   │   │   │       ├── VideoResponse.java
│   │   │   │       └── VideoStatsResponse.java
│   │   │   │
│   │   │   ├── entity/                               # JPA Entities
│   │   │   │   ├── User.java                         # User entity model
│   │   │   │   └── Video.java                        # Video entity model
│   │   │   │
│   │   │   ├── enums/                                # Enumeration types
│   │   │   │   └── Role.java                         # User roles enumeration
│   │   │   │
│   │   │   ├── exception/                            # Custom Exception Classes
│   │   │   │   ├── AccountDeactivatedException.java
│   │   │   │   ├── BadCredentialException.java
│   │   │   │   ├── EmailAlreadyExistsException.java
│   │   │   │   ├── EmailNotVarifiedException.java
│   │   │   │   ├── EmailSendingException.java
│   │   │   │   ├── GlobalExceptionHandeler.java      # Global exception handler
│   │   │   │   ├── InvalidCredentialsExpection.java
│   │   │   │   └── ResourceNotFoundExCeption.java
│   │   │   │
│   │   │   ├── Security/                             # Security components
│   │   │   │   ├── JwtAuthenticationFilter.java      # JWT filter for request authentication
│   │   │   │   └── JwtUtil.java                      # JWT utility methods
│   │   │   │
│   │   │   ├── Service/                              # Service Interfaces
│   │   │   │   ├── AuthService.java                  # Authentication service interface
│   │   │   │   └── EmailService.java                 # Email service interface
│   │   │   │
│   │   │   ├── ServiceImpl/                          # Service Implementations
│   │   │   │   ├── AuthServiceImpl.java              # Authentication service implementation
│   │   │   │   └── EmailServiceImpl.java             # Email service implementation
│   │   │   │
│   │   │   └── util/                                 # Utility classes
│   │   │       └── ServiceUtils.java                 # Common utility methods
│   │   │
│   │   └── resources/
│   │       ├── application.properties                # Application configuration
│   │       ├── static/                               # Static resources
│   │       └── templates/                            # Email templates
│   │
│   └── test/
│       └── java/com/arpon007/netflixclone/
│           └── NetflixcloneApplicationTests.java     # Application test class
│
├── target/                                           # Compiled classes and build artifacts
├── pom.xml                                           # Maven project configuration
├── mvnw                                              # Maven wrapper script (Unix)
├── mvnw.cmd                                          # Maven wrapper script (Windows)
├── Netflix_Clone_Auth_API.postman_collection.json   # Postman API collection
├── HELP.md                                           # Spring Boot help documentation
└── Readme.md                                         # Project documentation (this file)
```

## Database Configuration

The application uses MySQL as the database. Configure the following properties in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/netflixdb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Email Configuration

Email functionality requires SMTP configuration. Set up the following environment variables:

- `GMAIL_USER` - Your email address
- `GMAIL_PASS` - Your email password or app-specific password

## JWT Configuration

JWT secret key is configured in `application.properties`:

```properties
jwt.secret=your_secret_key_here
```

## File Upload Configuration

The application supports video and image uploads with configurable directories:

```properties
file.upload.video-dir=uploads/videos
file.upload.image-dir=uploads/images
spring.servlet.multipart.max-file-size=5GB
spring.servlet.multipart.max-request-size=5GB
```

## CORS Configuration

Frontend URL is configured for CORS:

```properties
app.frontend.url=http://localhost:3000
app.cors.allowed-origins=http://localhost:3000
```

## Prerequisites

- Java Development Kit (JDK) 25 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Installation and Setup

1. Clone the repository
2. Configure MySQL database and create a database named `netflixdb`
3. Update `application.properties` with your database credentials
4. Set up environment variables for email configuration
5. Build the project:
   ```bash
   mvn clean install
   ```
6. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080` by default.

## API Documentation

Import the `Netflix_Clone_Auth_API.postman_collection.json` file into Postman to explore available API endpoints.

## API Endpoints Overview

### Authentication Endpoints
- User Registration
- User Login
- Email Verification
- Password Reset
- Change Password

### User Management
- Get User Profile
- Update User Profile
- Deactivate Account

### Video Management
- Upload Video
- Get Video Details
- List Videos
- Update Video Information
- Delete Video

## Exception Handling

The application implements comprehensive exception handling with custom exceptions:

- Account Deactivated Exception
- Bad Credential Exception
- Email Already Exists Exception
- Email Not Verified Exception
- Email Sending Exception
- Invalid Credentials Exception
- Resource Not Found Exception

All exceptions are handled globally by `GlobalExceptionHandeler` class.

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control
- Email verification for new accounts
- Secure password reset flow

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package
```

The JAR file will be generated in the `target/` directory.

## License

This project is a demonstration/learning project.

## Author

Arpon007

## Notes

- Ensure all environment variables are properly configured before running the application
- Update JWT secret key for production deployment
- Configure proper CORS settings for production frontend URL
- Set up proper email service credentials for email functionality
