package com.arpon007.netflixclone.DTO.request;

import lombok.Data;

@Data
public class UserRequest {

    private String email;
    private String fullName;
    private String password;
    private String role;
    private Boolean active;
}
