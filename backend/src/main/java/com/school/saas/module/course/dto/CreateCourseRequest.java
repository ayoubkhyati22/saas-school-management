package com.school.saas.module.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCourseRequest {

    @NotNull(message = "Classroom ID is required")
    private UUID classRoomId;

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;

    @NotBlank(message = "Subject is required")
    @Size(max = 100, message = "Subject must not exceed 100 characters")
    private String subject;

    @Size(max = 50, message = "Subject code must not exceed 50 characters")
    private String subjectCode;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 500, message = "Schedule must not exceed 500 characters")
    private String schedule;

    @Size(max = 50, message = "Semester must not exceed 50 characters")
    private String semester;
}
