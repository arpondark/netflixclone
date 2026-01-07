package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank( message = "Email is Required")
    @Email( message = "Invalid Email")
    private String email;

    @NotBlank( message = "Password is Required")
    private String password;

}
