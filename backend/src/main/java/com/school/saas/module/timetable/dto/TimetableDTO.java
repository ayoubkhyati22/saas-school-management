package com.school.saas.module.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableDTO {
    private UUID id;
    private UUID schoolId;
    private UUID classRoomId;
    private String classRoomName;
    private String classRoomLevel;
    private UUID teacherId;
    private String teacherName;
    private UUID courseId;
    private String courseName;
    private String courseCode;
    private UUID specialityId;
    private String specialityName;
    private String specialityCode;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;
    private String semester;
    private String academicYear;
    private String notes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
