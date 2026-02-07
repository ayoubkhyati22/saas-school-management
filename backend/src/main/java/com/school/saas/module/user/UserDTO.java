package com.school.saas.module.user;

import com.school.saas.common.Role;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private UUID schoolId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private Boolean enabled;
    private LocalDateTime lastLoginAt;
}
