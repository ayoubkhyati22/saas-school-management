package com.school.saas.module.exam.dto;

import com.school.saas.module.exam.ResultStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultDTO {
    private String id;
    private String schoolId;
    private String examId;
    private String examTitle;
    private String studentId;
    private String studentName;
    private String studentRegistrationNumber;
    private Double marksObtained;
    private Integer maxMarks;
    private Double percentage;
    private String grade;
    private ResultStatus status;
    private String remarks;
    private Boolean absent;
    private Integer rank;
    private String gradedBy;
    private String gradedByName;
    private LocalDateTime gradedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class CreateExamResultRequest {

    @NotBlank(message = "Exam ID is required")
    private String examId;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotNull(message = "Marks obtained is required")
    @Min(value = 0, message = "Marks cannot be negative")
    private Double marksObtained;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    private String remarks;

    private Boolean absent;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class UpdateExamResultRequest {

    @Min(value = 0, message = "Marks cannot be negative")
    private Double marksObtained;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    private String remarks;

    private Boolean absent;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ResultStatisticsDTO {
    private Long totalResults;
    private Long passCount;
    private Long failCount;
    private Long absentCount;
    private Long pendingCount;
    private Double averagePercentage;
    private Double highestMarks;
    private Double lowestMarks;
}
