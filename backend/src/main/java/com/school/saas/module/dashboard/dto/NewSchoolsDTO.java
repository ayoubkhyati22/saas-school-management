package com.school.saas.module.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewSchoolsDTO {

    private String month; // Format: "2024-01" or "Jan 2024"
    private Long count;
}
