package com.school.saas.module.user;

import com.school.saas.common.Role;
import com.school.saas.security.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Create a new user", description = "Creates a new user in the system")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Update a user", description = "Updates an existing user by ID")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDTO updated = userService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get user by ID", description = "Retrieves a user by its ID")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        UserDTO user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all users", description = "Retrieves all users with pagination")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @PageableDefault(size = 20, sort = "firstName", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<UserDTO> users = userService.getAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get users by school", description = "Retrieves all users for a specific school")
    public ResponseEntity<Page<UserDTO>> getUsersBySchool(
            @PathVariable UUID schoolId,
            @PageableDefault(size = 20, sort = "firstName", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<UserDTO> users = userService.getBySchool(schoolId, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/school/{schoolId}/role/{role}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get users by school and role", description = "Retrieves users for a school filtered by role")
    public ResponseEntity<Page<UserDTO>> getUsersBySchoolAndRole(
            @PathVariable UUID schoolId,
            @PathVariable Role role,
            @PageableDefault(size = 20, sort = "firstName", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<UserDTO> users = userService.getBySchoolAndRole(schoolId, role, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/current/school/role/{role}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get users by role for current school", description = "Retrieves users filtered by role for current tenant")
    public ResponseEntity<Page<UserDTO>> getUsersByRoleForCurrentSchool(
            @PathVariable Role role,
            @PageableDefault(size = 20, sort = "firstName", direction = Sort.Direction.ASC) Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        Page<UserDTO> users = userService.getBySchoolAndRole(schoolId, role, pageable);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Delete a user", description = "Deletes a user by ID")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enable")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Enable a user", description = "Enables a disabled user")
    public ResponseEntity<Void> enableUser(@PathVariable UUID id) {
        userService.enable(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/disable")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Disable a user", description = "Disables an active user")
    public ResponseEntity<Void> disableUser(@PathVariable UUID id) {
        userService.disable(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/change-password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change user password", description = "Changes the password for a user")
    public ResponseEntity<Void> changePassword(
            @PathVariable UUID id,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.ok().build();
    }
}
