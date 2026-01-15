package com.arpon007.netflixclone.Service;

public interface EmailService {

    void sendVarificationEmail(String toEmaill, String token);
    void sendPasswordResetEmail(String toEmail, String token);

}
