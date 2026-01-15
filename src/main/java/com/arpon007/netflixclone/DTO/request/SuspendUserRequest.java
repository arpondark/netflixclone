package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuspendUserRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Active status is required")
    private Boolean active;

    private String reason;
}
