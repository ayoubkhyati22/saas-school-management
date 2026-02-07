package com.school.saas.module.dashboard.service;

import com.school.saas.module.dashboard.dto.*;

import java.util.List;

public interface SchoolAdminDashboardService {

    SchoolAdminDashboardDTO getOverview();

    List<EnrollmentTrendDTO> getEnrollmentTrend(int months);

    List<PaymentCollectionDTO> getPaymentCollection(int months);

    List<AttendanceChartDTO> getAttendanceChart(int days);

    List<RecentActivityDTO> getRecentActivities(int limit);

    SubscriptionInfoDTO getSubscriptionInfo();
}
