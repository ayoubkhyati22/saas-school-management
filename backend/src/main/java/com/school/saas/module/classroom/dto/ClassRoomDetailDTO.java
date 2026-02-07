package com.school.saas.module.classroom.dto;

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
public class ClassRoomDetailDTO {
    private UUID id;
    private UUID schoolId;
    private String schoolName;
    private String name;
    private String level;
    private String section;
    private String academicYear;
    private Integer capacity;
    private UUID classTeacherId;
    private String classTeacherName;
    private String classTeacherEmail;
    private long studentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
