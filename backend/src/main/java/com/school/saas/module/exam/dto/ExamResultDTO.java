package com.school.saas.module.exam.dto;

import com.school.saas.module.exam.ResultStatus;
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
