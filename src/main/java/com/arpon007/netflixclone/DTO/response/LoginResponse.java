package com.arpon007.netflixclone.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class LoginResponse {
    private String token;
    private String email;
    private String fulName;
    private String role;
    private String avatar;
}
