package com.school.saas.module.parent.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LinkStudentRequest {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Primary contact flag is required")
    private Boolean isPrimaryContact;

    @NotNull(message = "Relationship type is required")
    @Pattern(regexp = "FATHER|MOTHER|GUARDIAN|OTHER", message = "Relationship type must be FATHER, MOTHER, GUARDIAN, or OTHER")
    private String relationshipType;
}
