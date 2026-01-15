package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.DTO.response.UserResponse;
import com.arpon007.netflixclone.Service.AdminService;
import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.enums.Role;
import com.arpon007.netflixclone.exception.ResourceNotFoundExCeption;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found with id: " + userId));
        return convertToUserResponse(user);
    }

    @Override
    @Transactional
    public MessageResponse suspendUser(Long userId, Boolean active, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found with id: " + userId));

        // Prevent admin from suspending themselves
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot suspend admin users");
        }

        user.setActive(active);
        userRepository.save(user);

        String action = active ? "activated" : "suspended";
        log.info("User {} has been {}", user.getEmail(), action);

        return new MessageResponse("User " + action + " successfully" +
                (reason != null ? ". Reason: " + reason : ""));
    }

    @Override
    @Transactional
    public MessageResponse deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found with id: " + userId));

        // Prevent admin from deleting themselves
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete admin users");
        }

        userRepository.delete(user);
        log.info("User {} has been deleted", user.getEmail());

        return new MessageResponse("User deleted successfully");
    }

    @Override
    @Transactional
    public MessageResponse updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found with id: " + userId));

        try {
            Role newRole = Role.valueOf(role.toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);
            log.info("User {} role updated to {}", user.getEmail(), newRole);

            return new MessageResponse("User role updated successfully to " + newRole);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().toString());
        response.setActive(user.isActive());
        response.setEmailVerified(user.isEmailVerified());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
