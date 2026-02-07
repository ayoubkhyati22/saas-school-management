package com.school.saas.module.user;

import com.school.saas.common.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.UUID;

public interface UserService extends UserDetailsService {

    UserDTO create(CreateUserRequest request);

    UserDTO update(UUID id, UpdateUserRequest request);

    UserDTO getById(UUID id);

    Page<UserDTO> getAll(Pageable pageable);

    Page<UserDTO> getBySchool(UUID schoolId, Pageable pageable);

    Page<UserDTO> getBySchoolAndRole(UUID schoolId, Role role, Pageable pageable);

    List<UserDTO> getByRole(Role role);

    void delete(UUID id);

    void enable(UUID id);

    void disable(UUID id);

    void changePassword(UUID id, ChangePasswordRequest request);

    void updateLastLogin(UUID id);

    UserDetails loadUserByUsername(String userId);
}
