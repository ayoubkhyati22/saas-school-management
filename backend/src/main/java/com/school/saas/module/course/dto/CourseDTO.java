package com.school.saas.module.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private UUID id;
    private UUID schoolId;
    private UUID classRoomId;
    private String classRoomName;
    private UUID teacherId;
    private String teacherName;
    private UUID specialityId;
    private String specialityName;
    private String specialityCode;
    private String subject;
    private String subjectCode;
    private String description;
    private String schedule;
    private String semester;
    private String documents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
