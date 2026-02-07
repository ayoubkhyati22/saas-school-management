package com.school.saas.module.classroom.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignTeacherRequest {

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;
}
