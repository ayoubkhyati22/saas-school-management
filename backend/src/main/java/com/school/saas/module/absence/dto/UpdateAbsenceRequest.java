package com.school.saas.module.absence.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to update an absence record")
public class UpdateAbsenceRequest {

    @PastOrPresent(message = "Date cannot be in the future")
    @Schema(description = "Absence date")
    private LocalDate date;

    @Schema(description = "Reason for absence")
    private String reason;
}
