package com.school.saas.module.exam.dto;

import com.school.saas.module.exam.ExamStatus;
import com.school.saas.module.exam.ExamType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamDTO {
    private String id;
    private String schoolId;
    private String classRoomId;
    private String classRoomName;
    private String courseId;
    private String courseName;
    private String courseCode;
    private String teacherId;
    private String teacherName;
    private String specialityId;
    private String specialityName;
    private String title;
    private String description;
    private ExamType examType;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;
    private String roomNumber;
    private Integer maxMarks;
    private Integer passingMarks;
    private String semester;
    private String academicYear;
    private ExamStatus status;
    private String instructions;
    private Boolean allowCalculators;
    private Boolean allowBooks;
    private String notes;
    private Boolean resultsPublished;
    private LocalDateTime resultsPublishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
