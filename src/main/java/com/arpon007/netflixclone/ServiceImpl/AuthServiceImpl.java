package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.DTO.request.ChangePasswordRequest;
import com.arpon007.netflixclone.DTO.request.EmailRequest;
import com.arpon007.netflixclone.DTO.request.ResetPassword;
import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.Service.AuthService;
import com.arpon007.netflixclone.Service.EmailService;
import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.exception.BadCredentialException;
import com.arpon007.netflixclone.exception.InvalidCredentialsExpection;
import com.arpon007.netflixclone.exception.ResourceNotFoundExCeption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final long PASSWORD_RESET_TOKEN_EXPIRY_TIME = 3600000; // 1 hour in milliseconds

    /**
     * Send password reset email to user
     */
    @Override
    public MessageResponse forgotPassword(EmailRequest emailRequest) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(emailRequest.getEmail());
        if (userOptional.isEmpty()) {
            // Don't reveal if email exists for security reasons
            return new MessageResponse("If the email exists, a password reset link has been sent");
        }

        User user = userOptional.get();

        // Generate unique token
        String resetToken = UUID.randomUUID().toString();
        Instant tokenExpiry = Instant.now().plusMillis(PASSWORD_RESET_TOKEN_EXPIRY_TIME);

        // Save token and expiry to user
        user.setPasswordRestToken(resetToken);
        user.setPasswordRestTokenExpiry(tokenExpiry);
        userRepository.save(user);

        // Send password reset email
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        } catch (Exception e) {
            // Log the error but still return success message for security
            throw new RuntimeException("Failed to send password reset email. Please try again later.");
        }

        return new MessageResponse("If the email exists, a password reset link has been sent");
    }

    /**
     * Reset password using token and new password
     */
    @Override
    public MessageResponse resetPassword(ResetPassword resetPassword) {
        String token = resetPassword.getToken();
        String newPassword = resetPassword.getNewPassword();

        // Find user by reset token
        Optional<User> userOptional = userRepository.findAll().stream()
                .filter(user -> token.equals(user.getPasswordRestToken()))
                .findFirst();

        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundExCeption("Invalid password reset token");
        }

        User user = userOptional.get();

        // Check if token is expired
        if (user.getPasswordRestTokenExpiry() == null || Instant.now().isAfter(user.getPasswordRestTokenExpiry())) {
            throw new InvalidCredentialsExpection("Password reset token has expired. Please request a new one.");
        }

        // Update password
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(newPassword));
        user.setPasswordRestToken(null);
        user.setPasswordRestTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponse("Password has been reset successfully");
    }

    /**
     * Change password for authenticated user
     */
    @Override
    public MessageResponse changePassword(ChangePasswordRequest changePasswordRequest, String userEmail) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundExCeption("User not found");
        }

        User user = userOptional.get();

        // Verify current password
        org.springframework.security.crypto.password.PasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        if (!encoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialException("Current password is incorrect");
        }

        // Update password
        user.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Password has been changed successfully");
    }
}
