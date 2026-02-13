package com.school.saas.module.exam.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExamResultRequest {

    @Min(value = 0, message = "Marks cannot be negative")
    private Double marksObtained;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    private String remarks;

    private Boolean absent;
}
