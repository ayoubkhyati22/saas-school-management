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
public class SuperAdminDashboardDTO {

    private Long totalSchools;
    private Long activeSchools;
    private Long totalSubscriptions;

    private BigDecimal totalRevenue;
    private BigDecimal monthlyRecurringRevenue;

    private Long totalStudents;
    private Long totalTeachers;
    private Long totalAdmins;

    private Long openIssues;
    private Long resolvedIssues;

    private Double totalStorageUsed; // In GB
}
