package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.request.ChangePasswordRequest;
import com.arpon007.netflixclone.DTO.request.EmailRequest;
import com.arpon007.netflixclone.DTO.request.ResetPassword;
import com.arpon007.netflixclone.DTO.response.MessageResponse;

public interface AuthService {

    /**
     * Initiate password reset by sending reset email to user
     */
    MessageResponse forgotPassword(EmailRequest emailRequest);

    /**
     * Reset password using token and new password
     */
    MessageResponse resetPassword(ResetPassword resetPassword);

    /**
     * Change password for authenticated user
     */
    MessageResponse changePassword(ChangePasswordRequest changePasswordRequest, String userEmail);

}
