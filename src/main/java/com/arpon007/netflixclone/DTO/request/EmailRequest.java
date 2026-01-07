package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {
    @NotBlank( message = "Email cannot be blank")
    @Email( message = "Invalid email")
    private String email;

}
