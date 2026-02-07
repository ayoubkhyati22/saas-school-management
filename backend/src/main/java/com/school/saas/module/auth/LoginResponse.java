package com.school.saas.module.auth;

import com.school.saas.common.Role;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private UUID schoolId;
}
