package com.school.saas.module.absence.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to create an absence record")
public class CreateAbsenceRequest {

    @NotNull(message = "Student ID is required")
    @Schema(description = "Student ID", required = true)
    private UUID studentId;

    @NotNull(message = "Course ID is required")
    @Schema(description = "Course ID", required = true)
    private UUID courseId;

    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    @Schema(description = "Absence date", required = true)
    private LocalDate date;

    @Schema(description = "Reason for absence")
    private String reason;
}
