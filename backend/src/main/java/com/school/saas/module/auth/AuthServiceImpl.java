package com.school.saas.module.auth;

import com.school.saas.common.Role;
import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.exception.UnauthorizedException;
import com.school.saas.module.school.CreateSchoolRequest;
import com.school.saas.module.school.School;
import com.school.saas.module.school.SchoolRepository;
import com.school.saas.module.user.CreateUserRequest;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserDTO;
import com.school.saas.module.user.UserRepository;
import com.school.saas.module.user.UserMapper;
import com.school.saas.module.user.UserService;
import com.school.saas.security.JwtTokenProvider;
import com.school.saas.security.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Update last login
        userService.updateLastLogin(user.getId());

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole(), user.getSchoolId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("User logged in successfully: {}", user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .schoolId(user.getSchoolId())
                .build();
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!user.getEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        // Generate new tokens
        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole(), user.getSchoolId());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("Token refreshed successfully for user: {}", user.getEmail());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .schoolId(user.getSchoolId())
                .build();
    }

    @Override
    public UserDTO register(RegisterRequest request) {
        log.info("Registering new school: {}", request.getSchoolName());

        // Check if school email already exists
        if (schoolRepository.existsByEmail(request.getSchoolEmail())) {
            throw new BadRequestException("School with email " + request.getSchoolEmail() + " already exists");
        }

        // Check if admin email already exists
        if (userRepository.existsByEmail(request.getAdminEmail())) {
            throw new BadRequestException("User with email " + request.getAdminEmail() + " already exists");
        }

        // Create school
        School school = School.builder()
                .name(request.getSchoolName())
                .address(request.getSchoolAddress())
                .email(request.getSchoolEmail())
                .phone(request.getSchoolPhone())
                .active(true)
                .registrationDate(LocalDate.now())
                .build();
        School savedSchool = schoolRepository.save(school);

        // Create school admin user
        User adminUser = User.builder()
                .schoolId(savedSchool.getId())
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getAdminFirstName())
                .lastName(request.getAdminLastName())
                .phone(request.getAdminPhone())
                .role(Role.SCHOOL_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(adminUser);

        log.info("School registered successfully: {}", savedSchool.getName());
        log.info("Admin user created successfully: {}", savedAdmin.getEmail());

        return userMapper.toDTO(savedAdmin);
    }

    @Override
    public void logout() {
        log.info("User logging out");
        SecurityContextHolder.clearContext();
        TenantContext.clear();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser() {
        UUID userId = TenantContext.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("No authenticated user found");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        return userMapper.toDTO(user);
    }
}
