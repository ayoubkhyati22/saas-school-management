package com.school.saas.module.absence.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Absence statistics")
public class AbsenceStatisticsDTO {

    @Schema(description = "Total number of absences")
    private long totalAbsences;

    @Schema(description = "Number of justified absences")
    private long justifiedAbsences;

    @Schema(description = "Number of unjustified absences")
    private long unjustifiedAbsences;

    @Schema(description = "Start date of the period")
    private LocalDate startDate;

    @Schema(description = "End date of the period")
    private LocalDate endDate;

    @Schema(description = "Justification rate percentage")
    private double justificationRate;
}
