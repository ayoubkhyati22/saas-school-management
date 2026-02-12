package com.school.saas.module.timetable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTimetableRequest {

    @NotNull(message = "Classroom ID is required")
    private UUID classRoomId;

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;

    @NotNull(message = "Course ID is required")
    private UUID courseId;

    private UUID specialityId;

    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;

    @Size(max = 50, message = "Semester must not exceed 50 characters")
    private String semester;

    @NotBlank(message = "Academic year is required")
    @Size(max = 20, message = "Academic year must not exceed 20 characters")
    private String academicYear;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
