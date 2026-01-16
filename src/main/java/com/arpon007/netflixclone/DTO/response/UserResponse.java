package com.arpon007.netflixclone.DTO.response;

import com.arpon007.netflixclone.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private boolean active;
    private boolean emailVerified;
    private Set<String> favoriteCategories;
    private String avatar;
    private Integer age;
    private Instant createdAt;
    private Instant updatedAt;

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.isActive(),
                user.isEmailVerified(),
                user.getFavoriteCategories(),
                user.getAvatar(),
                user.getAge(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

}
