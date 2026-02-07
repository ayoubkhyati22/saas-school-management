package com.school.saas.module.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentDetailDTO {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private UUID schoolId;
    private String schoolName;
    private String occupation;
    private String address;
    private List<ParentStudentDTO> children;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
