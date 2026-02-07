package com.school.saas.module.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDTO {

    private String type; // NEW_STUDENT, PAYMENT_RECEIVED, ISSUE_REPORTED, etc.
    private String description;
    private LocalDateTime timestamp;
}
