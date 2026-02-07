package com.school.saas.module.teacher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherDTO {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;
    private UUID schoolId;
    private String speciality;
    private LocalDate hireDate;
    private String employeeNumber;
    private String status;
    private BigDecimal salary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
