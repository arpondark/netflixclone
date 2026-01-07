package com.arpon007.netflixclone.dao;

import com.arpon007.netflixclone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
