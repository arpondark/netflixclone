package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

public class ChangePasswordRequest {
    @NotBlank( message = "Current password cannot be blank")
    private String currentPassword;

    @NotNull( message = "New password cannot be null")
    private String newPassword;

}
