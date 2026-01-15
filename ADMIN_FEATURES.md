# Admin Management System Documentation

## Overview

The Netflix Clone application includes a comprehensive admin management system that automatically creates an admin user on startup and provides full user management capabilities.

## Admin Auto-Seeder

### Configuration

Admin credentials are configured in `application.properties`:

```properties
admin.email=admin@netflixclone.com
admin.password=admin123
admin.fullname=System Administrator
```

### How It Works

- The `AdminSeeder` component runs automatically when the application starts
- It checks if an admin user with the configured email already exists
- If not found, it creates a new admin user with:
  - Email from configuration
  - Password from configuration
  - Full name from configuration
  - Role: ADMIN
  - Active: true
  - Email Verified: true
- Logs are generated confirming admin creation or existence

### Customization

To change admin credentials:
1. Edit `application.properties` before first run
2. Update the admin.email, admin.password, and admin.fullname values
3. Restart the application

## Admin API Endpoints

All admin endpoints require:
- Valid JWT token with ADMIN role
- Authorization header: `Bearer {admin_token}`

### 1. Get All Users

**Endpoint**: `GET /api/admin/users`

**Description**: Retrieve a list of all registered users

**Response**: Array of UserResponse objects containing:
- id
- email
- fullName
- role
- active
- emailVerified
- createdAt
- updatedAt

### 2. Get User By ID

**Endpoint**: `GET /api/admin/users/{userId}`

**Description**: Get detailed information about a specific user

**Path Parameters**:
- userId: Long - The ID of the user to retrieve

**Response**: UserResponse object with user details

### 3. Suspend/Activate User

**Endpoint**: `PUT /api/admin/users/suspend`

**Description**: Suspend or activate a user account

**Request Body**:
```json
{
  "userId": 2,
  "active": false,
  "reason": "Violation of terms of service"
}
```

**Fields**:
- userId: Long (required) - ID of the user
- active: Boolean (required) - true to activate, false to suspend
- reason: String (optional) - Reason for the action

**Response**: MessageResponse with success message

**Security**: Cannot suspend admin users

### 4. Delete User

**Endpoint**: `DELETE /api/admin/users/{userId}`

**Description**: Permanently delete a user account

**Path Parameters**:
- userId: Long - The ID of the user to delete

**Response**: MessageResponse with success message

**Security**: Cannot delete admin users

### 5. Update User Role

**Endpoint**: `PUT /api/admin/users/{userId}/role?role={ROLE}`

**Description**: Change a user's role

**Path Parameters**:
- userId: Long - The ID of the user

**Query Parameters**:
- role: String - New role (USER or ADMIN)

**Response**: MessageResponse with success message

## Security Features

### Role-Based Access Control

- All admin endpoints are protected by `@PreAuthorize("hasRole('ADMIN')")`
- Spring Security validates the JWT token role before allowing access
- Non-admin users receive 403 Forbidden responses

### Admin Protection

- Admin users cannot suspend other admin accounts
- Admin users cannot delete other admin accounts
- This prevents accidental system lockout

### Authentication Flow

1. Admin logs in via `/api/auth/login` with admin credentials
2. System returns JWT token with ADMIN role
3. Admin includes token in Authorization header for all admin operations
4. System validates token and role before processing requests

## Service Layer

### AdminService Interface

Defines the contract for admin operations:
- getAllUsers()
- getUserById(Long userId)
- suspendUser(Long userId, Boolean active, String reason)
- deleteUser(Long userId)
- updateUserRole(Long userId, String role)

### AdminServiceImpl

Implements all admin operations with:
- Transaction management (@Transactional)
- Exception handling for not found resources
- Role validation
- Security checks (no admin suspension/deletion)
- Logging of all admin actions

## Exception Handling

### ResourceNotFoundExCeption

Thrown when:
- User with specified ID doesn't exist
- Attempting to get/modify non-existent user

### IllegalArgumentException

Thrown when:
- Attempting to suspend/delete admin users
- Providing invalid role name
- Invalid request parameters

## Logging

All admin actions are logged with:
- User email affected
- Action performed (suspended, activated, deleted, role updated)
- Using SLF4J logger

Example log messages:
```
Admin user created successfully with email: admin@netflixclone.com
User testuser@example.com has been suspended
User testuser@example.com role updated to ADMIN
```

## Postman Collection

### Admin Login Request

Saves admin token automatically to environment variable `admin_token`:

```json
{
  "email": "admin@netflixclone.com",
  "password": "admin123"
}
```

### Test Scripts

Admin login includes test script to auto-save token:
```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("admin_token", jsonData.token);
  console.log("Admin Token saved: " + jsonData.token);
}
```

### Available Admin Requests

1. Admin Login
2. Get All Users
3. Get User By ID
4. Suspend User
5. Activate User
6. Delete User
7. Update User Role
8. Admin Access Unauthorized Test (403 test)

## Database Schema

### Users Table Updates

The User entity supports admin features with:
- role: Enum (USER, ADMIN)
- active: Boolean (for suspension)
- All timestamp fields for auditing

## Best Practices

### Security

1. Change default admin password in production
2. Use strong passwords for admin accounts
3. Store admin credentials in environment variables for production
4. Regularly audit admin actions through logs

### Operations

1. Always provide a reason when suspending users
2. Review user details before deletion
3. Be careful when changing roles to ADMIN
4. Monitor logs for admin actions

### Testing

1. Test with both admin and regular user tokens
2. Verify 403 responses for unauthorized access
3. Test all edge cases (admin suspension attempts, etc.)
4. Use Postman collection for comprehensive testing

## Production Deployment

### Environment Variables

Override application.properties values with environment variables:

```bash
ADMIN_EMAIL=your-admin@company.com
ADMIN_PASSWORD=your-strong-password
ADMIN_FULLNAME=Admin Name
```

### Security Checklist

- [ ] Change default admin password
- [ ] Use environment variables for credentials
- [ ] Enable HTTPS for all admin endpoints
- [ ] Implement rate limiting on admin endpoints
- [ ] Set up monitoring and alerting for admin actions
- [ ] Regular security audits
- [ ] Implement admin action audit trail

## Troubleshooting

### Admin User Not Created

Check:
1. Database connection is working
2. application.properties file is properly configured
3. No existing user with same email
4. Application logs for error messages

### Cannot Access Admin Endpoints

Check:
1. JWT token is valid and not expired
2. Token contains ADMIN role
3. Authorization header format: `Bearer {token}`
4. User logging in has ADMIN role in database

### 403 Forbidden Error

Causes:
- Using regular user token instead of admin token
- Token expired
- User role is not ADMIN
- Token format incorrect

Solution:
- Re-login as admin to get fresh token
- Verify role in database
- Check Authorization header format
