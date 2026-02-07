package com.school.saas.module.auth;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "School name is required")
    @Size(max = 200, message = "School name must not exceed 200 characters")
    private String schoolName;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String schoolAddress;

    @NotBlank(message = "School email is required")
    @Email(message = "School email must be valid")
    @Size(max = 100, message = "School email must not exceed 100 characters")
    private String schoolEmail;

    @Size(max = 20, message = "School phone must not exceed 20 characters")
    private String schoolPhone;

    @NotBlank(message = "Admin first name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String adminFirstName;

    @NotBlank(message = "Admin last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String adminLastName;

    @NotBlank(message = "Admin email is required")
    @Email(message = "Admin email must be valid")
    @Size(max = 100, message = "Admin email must not exceed 100 characters")
    private String adminEmail;

    @Size(max = 20, message = "Admin phone must not exceed 20 characters")
    private String adminPhone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit")
    private String password;
}
