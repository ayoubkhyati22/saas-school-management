package com.school.saas.module.classroom.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateClassRoomRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Size(max = 50, message = "Level must not exceed 50 characters")
    private String level;

    @Size(max = 50, message = "Section must not exceed 50 characters")
    private String section;

    @NotBlank(message = "Academic year is required")
    @Size(max = 20, message = "Academic year must not exceed 20 characters")
    private String academicYear;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private UUID classTeacherId;
}
