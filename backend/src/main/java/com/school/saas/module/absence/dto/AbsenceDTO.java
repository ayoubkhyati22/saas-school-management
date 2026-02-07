package com.school.saas.module.absence.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Absence details")
public class AbsenceDTO {

    @Schema(description = "Absence ID")
    private UUID id;

    @Schema(description = "School ID")
    private UUID schoolId;

    @Schema(description = "Student ID")
    private UUID studentId;

    @Schema(description = "Student name")
    private String studentName;

    @Schema(description = "Course ID")
    private UUID courseId;

    @Schema(description = "Course subject")
    private String courseSubject;

    @Schema(description = "Absence date")
    private LocalDate date;

    @Schema(description = "Reason for absence")
    private String reason;

    @Schema(description = "Whether the absence is justified")
    private Boolean justified;

    @Schema(description = "Path to justification document")
    private String justificationDocument;

    @Schema(description = "Teacher who reported the absence")
    private UUID reportedBy;

    @Schema(description = "Teacher name who reported")
    private String reportedByName;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
