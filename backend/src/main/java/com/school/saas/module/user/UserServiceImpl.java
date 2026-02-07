package com.school.saas.module.user;

import com.school.saas.common.Role;
import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.exception.UnauthorizedException;
import com.school.saas.module.subscription.SubscriptionLimitService;
import com.school.saas.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionLimitService subscriptionLimitService;

    @Override
    public UserDTO create(CreateUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with email " + request.getEmail() + " already exists");
        }

        // Validate subscription limits
        if (request.getSchoolId() != null) {
            if (request.getRole() == Role.STUDENT) {
                subscriptionLimitService.validateStudentLimit(request.getSchoolId());
            } else if (request.getRole() == Role.TEACHER) {
                subscriptionLimitService.validateTeacherLimit(request.getSchoolId());
            }
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);

        log.info("User created successfully with ID: {}", saved.getId());
        return userMapper.toDTO(saved);
    }

    @Override
    public UserDTO update(UUID id, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", id);

        User user = findUserById(id);

        if (request.getEmail() != null &&
            !request.getEmail().equals(user.getEmail()) &&
            userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new BadRequestException("User with email " + request.getEmail() + " already exists");
        }

        userMapper.updateEntity(request, user);
        User updated = userRepository.save(user);

        log.info("User updated successfully with ID: {}", id);
        return userMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getById(UUID id) {
        log.info("Fetching user with ID: {}", id);
        User user = findUserById(id);
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAll(Pageable pageable) {
        log.info("Fetching all users with pagination");
        return userRepository.findAll(pageable)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getBySchool(UUID schoolId, Pageable pageable) {
        log.info("Fetching users for school ID: {}", schoolId);
        return userRepository.findBySchoolId(schoolId, pageable)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getBySchoolAndRole(UUID schoolId, Role role, Pageable pageable) {
        log.info("Fetching users for school ID: {} with role: {}", schoolId, role);
        return userRepository.findBySchoolIdAndRole(schoolId, role, pageable)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getByRole(Role role) {
        log.info("Fetching all users with role: {}", role);
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == role)
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        log.info("Deleting user with ID: {}", id);
        User user = findUserById(id);
        userRepository.delete(user);
        log.info("User deleted successfully with ID: {}", id);
    }

    @Override
    public void enable(UUID id) {
        log.info("Enabling user with ID: {}", id);
        User user = findUserById(id);
        user.setEnabled(true);
        userRepository.save(user);
        log.info("User enabled successfully with ID: {}", id);
    }

    @Override
    public void disable(UUID id) {
        log.info("Disabling user with ID: {}", id);
        User user = findUserById(id);
        user.setEnabled(false);
        userRepository.save(user);
        log.info("User disabled successfully with ID: {}", id);
    }

    @Override
    public void changePassword(UUID id, ChangePasswordRequest request) {
        log.info("Changing password for user with ID: {}", id);

        User user = findUserById(id);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user with ID: {}", id);
    }

    @Override
    public void updateLastLogin(UUID id) {
        log.debug("Updating last login for user with ID: {}", id);
        User user = findUserById(id);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        log.debug("Loading user by ID: {}", userId);

        try {
            UUID id = UUID.fromString(userId);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

            return new UserPrincipal(user);
        } catch (IllegalArgumentException e) {
            throw new UsernameNotFoundException("Invalid user ID format: " + userId);
        }
    }

    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
}
