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
public class CourseDetailDTO {
    private UUID id;
    private UUID schoolId;
    private String schoolName;
    private UUID classRoomId;
    private String classRoomName;
    private String classRoomLevel;
    private UUID teacherId;
    private String teacherName;
    private String teacherEmail;
    private String subject;
    private String subjectCode;
    private String description;
    private String schedule;
    private String semester;
    private long materialCount;
    private String documents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
