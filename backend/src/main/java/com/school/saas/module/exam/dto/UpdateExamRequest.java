package com.school.saas.module.exam.dto;

import com.school.saas.module.exam.ExamStatus;
import com.school.saas.module.exam.ExamType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExamRequest {

    private String teacherId;

    private String specialityId;

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private ExamType examType;

    private LocalDate examDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 720, message = "Duration must not exceed 720 minutes")
    private Integer durationMinutes;

    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;

    @Min(value = 1, message = "Maximum marks must be at least 1")
    private Integer maxMarks;

    @Min(value = 0, message = "Passing marks cannot be negative")
    private Integer passingMarks;

    @Size(max = 50, message = "Semester must not exceed 50 characters")
    private String semester;

    @Size(max = 20, message = "Academic year must not exceed 20 characters")
    private String academicYear;

    private ExamStatus status;

    @Size(max = 2000, message = "Instructions must not exceed 2000 characters")
    private String instructions;

    private Boolean allowCalculators;

    private Boolean allowBooks;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
