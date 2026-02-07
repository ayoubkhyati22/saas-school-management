package com.school.saas.module.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionInfoDTO {

    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long daysRemaining;
    private String status; // ACTIVE, EXPIRED, CANCELLED
    private List<String> features;
}
