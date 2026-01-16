package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email cannot be blank")
    @Size(min = 5, max = 255, message = "Email must be between 5 and 255 characters")
    private String email;

    @jakarta.validation.constraints.Min(value = 13, message = "You must be at least 13 years old")
    @jakarta.validation.constraints.Max(value = 120, message = "Invalid age")
    private Integer age;
}
