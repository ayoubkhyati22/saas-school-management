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
public class SchoolAdminDashboardDTO {

    private Long totalStudents;
    private Long totalTeachers;
    private Long totalClasses;
    private Long totalCourses;

    private Long activeStudents;
    private Long inactiveStudents;

    private Long pendingPaymentsCount;
    private BigDecimal pendingPaymentsAmount;

    private Long overduePaymentsCount;
    private BigDecimal overduePaymentsAmount;

    private Double attendanceRate; // Percentage

    private Double storageUsed; // In GB
    private Double storageLimit; // In GB
}
