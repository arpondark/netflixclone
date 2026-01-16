package com.arpon007.netflixclone.config;

import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2) // Run after CategorySeeder
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.fullname}")
    private String adminFullName;

    @Override
    public void run(String... args) {
        seedAdmin();
    }

    private void seedAdmin() {
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);

        if (existingAdmin.isPresent()) {
            log.info("Admin user already exists with email: {}", adminEmail);
            return;
        }

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(adminPassword));
        admin.setFullName(adminFullName);
        admin.setRole(Role.ADMIN);
        admin.setActive(true);
        admin.setEmailVerified(true);

        userRepository.save(admin);
        log.info("Admin user created successfully with email: {}", adminEmail);
    }
}
