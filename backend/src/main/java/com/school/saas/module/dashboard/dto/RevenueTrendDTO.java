package com.school.saas.module.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueTrendDTO {

    private String month; // Format: "2024-01" or "Jan 2024"
    private BigDecimal amount;
}
