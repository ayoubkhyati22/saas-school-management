package com.school.saas.module.school;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolDTO {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private Boolean active;
    private LocalDate registrationDate;
}
