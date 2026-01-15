package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.Service.EmailService;
import com.arpon007.netflixclone.exception.EmailNotVarifiedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontedUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;


    @Override
    public void sendVarificationEmail(String toEmaill, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmaill);
            message.setSubject("Email Verification");
            String verificationUrl = frontedUrl + "/verify-email?token=" + token;
            message.setText("Please click the following link to verify your email address: " + verificationUrl);
            mailSender.send(message);
            logger.info("Verification email sent to {}", toEmaill+"code is:"+" "+token);
        } catch (Exception e) {
            logger.error("Error sending verification email to {}: {}", toEmaill, e.getMessage());
            throw new EmailNotVarifiedException("Failed to send verification email. Please try again later.");

        }

    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request");
            String resetUrl = frontedUrl + "/reset-password?token=" + token;
            message.setText("Please click the following link to reset your password: " + resetUrl);
            mailSender.send(message);
            logger.info("Password reset email sent to {}", toEmail+"code is:"+" "+token);
        } catch (Exception e) {
            logger.error("Error sending password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send password reset email. Please try again later.");
        }

    }
}
