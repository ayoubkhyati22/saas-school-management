package com.school.saas.module.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchoolListItemDTO {

    private UUID id;
    private String name;
    private String planName;
    private Long studentCount;
    private String status; // ACTIVE, INACTIVE
    private LocalDate subscriptionEndDate;
}
