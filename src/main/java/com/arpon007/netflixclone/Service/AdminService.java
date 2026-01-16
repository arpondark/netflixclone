package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.request.UpdateAdminProfileRequest;
import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.DTO.response.UserResponse;
import com.arpon007.netflixclone.entity.User;

import java.util.List;

public interface AdminService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long userId);

    MessageResponse suspendUser(Long userId, Boolean active, String reason);

    MessageResponse deleteUser(Long userId);

    MessageResponse updateUserRole(Long userId, String role);

    MessageResponse updateAdminProfile(String email, UpdateAdminProfileRequest request);
}
