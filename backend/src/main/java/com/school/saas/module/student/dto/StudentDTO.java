package com.school.saas.module.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;
    private UUID schoolId;
    private UUID classRoomId;
    private String classRoomName;
    private String registrationNumber;
    private LocalDate birthDate;
    private String gender;
    private LocalDate enrollmentDate;
    private String status;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
