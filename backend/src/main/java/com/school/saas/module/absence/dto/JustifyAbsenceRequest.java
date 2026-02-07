package com.school.saas.module.absence.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to justify an absence")
public class JustifyAbsenceRequest {

    @NotBlank(message = "Justification document path is required")
    @Schema(description = "Path to justification document", required = true)
    private String justificationDocument;

    @Schema(description = "Additional reason or note")
    private String reason;
}
