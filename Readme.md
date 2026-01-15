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
- Auto-Seeding on Application Startup
  - Admin User Auto-Creation
  - 22 Movie Categories Auto-Creation
- Admin User Management
  - View All Users
  - View User Details
  - Suspend/Activate User Accounts
  - Delete User Accounts
  - Update User Roles
- Category Management
  - Predefined Movie/Show Categories
  - Get All Categories API
  - Category-based Video Organization

## Database Schema

The application uses the following database schema:

```mermaid
erDiagram
    USERS ||--o{ USER_WATCHLIST : has
    USERS ||--o{ USER_FAVORITE_CATEGORIES : has
    USERS ||--o{ VIDEO_VIEWS : records
    VIDEOS ||--o{ USER_WATCHLIST : contains
    VIDEOS ||--o{ VIDEO_CATEGORIES : has
    VIDEOS ||--o{ VIDEO_VIEWS : tracked
    
    USERS {
        bigint id PK
        varchar email UK "Unique"
        varchar fullName
        varchar password
        enum role "USER, ADMIN"
        boolean active "Default true"
        boolean emailVerified "Default false"
        varchar verificationToken UK
        timestamp verificationTokenExpiry
        varchar passwordRestToken
        timestamp passwordRestTokenExpiry
        timestamp createdAt
        timestamp updatedAt
    }
    
    VIDEOS {
        bigint video_id PK
        varchar title "Required"
        text description "Max 4000 chars, Required"
        int year
        varchar rating
        varchar src "UUID filename, Required"
        varchar poster "UUID filename, Required"
        int duration
        boolean published "Default false"
        timestamp createdAt
        timestamp updatedAt
    }

    CATEGORIES {
        bigint id PK
        varchar name UK "Unique, Required"
        varchar description "Max 500 chars"
        boolean active "Default true"
        timestamp createdAt
        timestamp updatedAt
    }
    
    VIDEO_CATEGORIES {
        bigint video_id FK
        varchar category "Required"
    }
    
    USER_WATCHLIST {
        bigint user_id FK
        bigint video_id FK
    }
    
    USER_FAVORITE_CATEGORIES {
        bigint user_id FK
        varchar category_name "Max 3 per user"
    }
    
    VIDEO_VIEWS {
        bigint id PK
        bigint user_id FK
        bigint video_id FK
        timestamp viewedAt
    }
```

### Entity Relationships

- **Users to Watchlist**: One-to-Many (A user can have multiple videos in their watchlist)
- **Users to Favorite Categories**: One-to-Many (A user can select up to 3 favorite categories)
- **Users to Video Views**: One-to-Many (A user can view multiple videos)
- **Videos to Watchlist**: One-to-Many (A video can be in multiple users' watchlists)
- **Videos to Categories**: One-to-Many (A video can have multiple categories)
- **Videos to Views**: One-to-Many (A video can be viewed by multiple users)
- **Categories**: Standalone table with predefined movie/show categories

### Key Constraints

- User email must be unique
- Video title, description, src (video file), and poster (image) are required
- Video categories are stored in a separate join table for flexibility
- Category names are unique and auto-seeded on application startup
- Users can select maximum 3 favorite categories
- Each video view is tracked per user (one view per user per video)
- Timestamps are automatically managed by Hibernate

### Auto-Seeded Data

The application automatically seeds the following data on startup:

1. **Admin User**: Created from application.properties credentials
2. **Categories**: 22 predefined movie/show categories including:
   - Action, Adventure, Animation, Biography, Comedy, Crime
   - Documentary, Drama, Family, Fantasy, Film-Noir, History
   - Horror, Music, Musical, Mystery, Romance, Sci-Fi
   - Sport, Thriller, War, Western

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
│   │   │   │   ├── SecurityConfig.java               # Security and authentication configuration
│   │   │   │   ├── CategorySeeder.java               # Auto-seed movie categories on startup
│   │   │   │   └── AdminSeeder.java                  # Auto-seed admin user on startup
│   │   │   │
│   │   │   ├── controller/                           # REST API Controllers
│   │   │   │   ├── AuthController.java               # Authentication endpoints
│   │   │   │   ├── AdminController.java              # Admin management endpoints
│   │   │   │   ├── VideoController.java              # Video management endpoints
│   │   │   │   └── CategoryController.java           # Category endpoints
│   │   │   │
│   │   │   ├── dao/                                  # Data Access Objects (Repositories)
│   │   │   │   ├── UserRepository.java               # User database operations
│   │   │   │   ├── VideoRepository.java              # Video database operations
│   │   │   │   └── CategoryRepository.java           # Category database operations
│   │   │   │
│   │   │   ├── DTO/                                  # Data Transfer Objects
│   │   │   │   ├── request/                          # Request DTOs
│   │   │   │   │   ├── ChangePasswordRequest.java
│   │   │   │   │   ├── EmailRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── ResetPassword.java
│   │   │   │   │   ├── SuspendUserRequest.java
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
│   │   │   │       ├── VideoStatsResponse.java
│   │   │   │       └── CategoryResponse.java
│   │   │   │
│   │   │   ├── entity/                               # JPA Entities
│   │   │   │   ├── User.java                         # User entity model
│   │   │   │   ├── Video.java                        # Video entity model
│   │   │   │   ├── Category.java                     # Category entity model
│   │   │   │   └── VideoView.java                    # Video view tracking model
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
│   │   │   │   ├── EmailService.java                 # Email service interface
│   │   │   │   ├── AdminService.java                 # Admin service interface
│   │   │   │   ├── VideoService.java                 # Video service interface
│   │   │   │   ├── CategoryService.java              # Category service interface
│   │   │   │   └── UserService.java                  # User features service interface
│   │   │   │
│   │   │   ├── ServiceImpl/                          # Service Implementations
│   │   │   │   ├── AuthServiceImpl.java              # Authentication service implementation
│   │   │   │   ├── EmailServiceImpl.java             # Email service implementation
│   │   │   │   ├── AdminServiceImpl.java             # Admin service implementation
│   │   │   │   ├── VideoServiceImpl.java             # Video service implementation
│   │   │   │   ├── CategoryServiceImpl.java          # Category service implementation
│   │   │   │   ├── UserServiceImpl.java              # User features service implementation
│   │   │   │   └── FileStorageService.java           # File storage service
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

## Admin Configuration

The application automatically creates an admin user on startup using credentials from application.properties:

```properties
admin.email=admin@netflixclone.com
admin.password=admin123
admin.fullname=System Administrator
```

These credentials can be changed in the `application.properties` file before running the application.

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

### User Features (Authenticated Users)
- Get User Profile with Favorite Categories
- Update Favorite Categories (Max 3)
- Add Video to Watchlist
- Remove Video from Watchlist
- Get User's Watchlist
- Record Video View (When Opening/Watching)
- Get Video View Count

### Category Management
- Get All Active Categories
- Get All Categories (Admin)
- Get Category By ID

### Admin Management (Admin Role Required)
- Get All Users
- Get User By ID
- Suspend User Account
- Activate User Account
- Delete User Account
- Update User Role

### Video Management (Admin Role Required for Upload)
- Upload Video with Poster
- Get Video Details
- List Videos
- Update Video Information
- Delete Video

## Admin Features

### Auto-Seeder
The application automatically creates an admin account on first startup using credentials from `application.properties`. This ensures there is always an admin user available to manage the system.

### User Management
Administrators can perform the following operations:

1. **View All Users**: Get a complete list of all registered users with their details
2. **View User Details**: Get detailed information about a specific user by ID
3. **Suspend Users**: Deactivate user accounts with optional reason
4. **Activate Users**: Reactivate suspended user accounts
5. **Delete Users**: Permanently remove user accounts from the system
6. **Update Roles**: Change user roles between USER and ADMIN

### Security Restrictions
- Admin users cannot suspend or delete other admin accounts
- All admin endpoints require ADMIN role authentication
- JWT token with ADMIN role must be provided in the Authorization header

## Video Upload and Management

### Video Upload Features

The application supports comprehensive video upload with the following capabilities:

#### Required Fields
- **Title**: Video title (cannot be blank)
- **Description**: Full description of the video (up to 4000 characters, required)
- **Poster Image**: Thumbnail or poster image for the video (required)
- **Video File**: The actual video file to upload (required)
- **Categories**: At least one category must be selected (required)

#### Optional Fields
- **Year**: Release year of the video
- **Rating**: Content rating (e.g., PG, PG-13, R, etc.)
- **Duration**: Video duration in minutes
- **Published**: Boolean flag to publish or keep as draft (default: false)

### Upload Endpoint

**Endpoint**: `POST /api/videos/upload`

**Authentication**: Requires ADMIN role

**Content-Type**: `multipart/form-data`

**Request Parts**:

1. **data** (application/json):
```json
{
  "title": "Movie Title",
  "description": "Detailed description of the movie",
  "year": 2024,
  "rating": "PG-13",
  "duration": 120,
  "published": true,
  "categories": ["Action", "Adventure", "Sci-Fi"]
}
```

2. **video** (file): The video file (required)
3. **poster** (file): The poster/thumbnail image (required)

**Note**: All three parts (data, video, and poster) are mandatory for successful upload. The data part must include title, description, and at least one category.

#### Minimal Upload (Required Fields Only)

Using cURL:
```bash
curl -X POST http://localhost:8080/api/videos/upload \
  -H "Authorization: Bearer {admin_token}" \
  -F 'data={"title":"Sample Movie","description":"This is the movie description","categories":["Drama"]};type=application/json' \
  -F 'video=@/path/to/video.mp4' \
  -F 'poster=@/path/to/poster.jpg'
```

**Important**: Title, description, at least one category, video file, and poster image are all required for successful upload.

### List All Videos

**Endpoint**: `GET /api/videos`

Returns array of all videos with their complete information including URLs to access the video and poster files.

## User Features

### User Profile with Favorite Categories

Users can personalize their experience by selecting up to 3 favorite categories from the predefined list.

#### Get User Profile
**Endpoint**: `GET /api/user/profile`

**Authentication**: Required (JWT token)

**Response**:
```json
{
  "id": 2,
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "active": true,
  "emailVerified": true,
  "favoriteCategories": ["Action", "Comedy", "Sci-Fi"],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-16T14:30:00Z"
}
```

#### Update Favorite Categories
**Endpoint**: `PUT /api/user/favorite-categories`

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "favoriteCategories": ["Action", "Comedy", "Drama"]
}
```

**Constraints**:
- Minimum: 1 category
- Maximum: 3 categories
- Must be valid category names from the predefined list

### Watchlist Management

Users can add videos to their personal watchlist for later viewing.

#### Add Video to Watchlist
**Endpoint**: `POST /api/user/watchlist/{videoId}`

**Authentication**: Required (JWT token)

#### Remove Video from Watchlist
**Endpoint**: `DELETE /api/user/watchlist/{videoId}`

**Authentication**: Required (JWT token)

#### Get User's Watchlist
**Endpoint**: `GET /api/user/watchlist`

**Authentication**: Required (JWT token)

Returns array of videos in user's watchlist with complete information.

### Video View Tracking

The system automatically tracks video views to provide analytics.

#### Record Video View
**Endpoint**: `POST /api/user/videos/{videoId}/view`

**Authentication**: Required (JWT token)

**Usage**: Call this endpoint when a user opens or starts watching a video. Each user can only contribute one view per video.

#### Get Video View Count
**Endpoint**: `GET /api/user/videos/{videoId}/views`

**Authentication**: Not required

Returns the total number of unique views for the video.

### Usage Flow

1. User registers and logs in
2. User selects 1-3 favorite categories
3. User browses videos
4. When user opens a video, system records the view
5. User can add videos to watchlist
6. User can access watchlist anytime

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

MD. SHAZAN MAHMUD ARPON

## Notes

- Ensure all environment variables are properly configured before running the application
- Update JWT secret key for production deployment
- Configure proper CORS settings for production frontend URL
- Set up proper email service credentials for email functionality
