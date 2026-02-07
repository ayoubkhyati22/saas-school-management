package com.school.saas.module.dashboard.controller;

import com.school.saas.dto.ApiResponse;
import com.school.saas.module.dashboard.dto.*;
import com.school.saas.module.dashboard.service.SchoolAdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/school-admin")
@RequiredArgsConstructor
@Tag(name = "School Admin Dashboard", description = "School Admin Dashboard APIs")
@PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
public class SchoolAdminDashboardController {

    private final SchoolAdminDashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(summary = "Get dashboard overview", description = "Get complete dashboard overview with KPIs")
    public ResponseEntity<ApiResponse<SchoolAdminDashboardDTO>> getOverview() {
        SchoolAdminDashboardDTO overview = dashboardService.getOverview();
        return ResponseEntity.ok(ApiResponse.success("Dashboard overview fetched successfully",overview));
    }

    @GetMapping("/enrollment-trend")
    @Operation(summary = "Get enrollment trend", description = "Get enrollment trend for last N months")
    public ResponseEntity<ApiResponse<List<EnrollmentTrendDTO>>> getEnrollmentTrend(
            @RequestParam(defaultValue = "6") int months) {
        List<EnrollmentTrendDTO> trend = dashboardService.getEnrollmentTrend(months);
        return ResponseEntity.ok(ApiResponse.success("Enrollment trend fetched successfully", trend));
    }

    @GetMapping("/payment-collection")
    @Operation(summary = "Get payment collection", description = "Get payment collection for last N months")
    public ResponseEntity<ApiResponse<List<PaymentCollectionDTO>>> getPaymentCollection(
            @RequestParam(defaultValue = "12") int months) {
        List<PaymentCollectionDTO> collection = dashboardService.getPaymentCollection(months);
        return ResponseEntity.ok(ApiResponse.success("Payment collection fetched successfully", collection));
    }

    @GetMapping("/attendance")
    @Operation(summary = "Get attendance chart", description = "Get attendance chart for last N days")
    public ResponseEntity<ApiResponse<List<AttendanceChartDTO>>> getAttendanceChart(
            @RequestParam(defaultValue = "30") int days) {
        List<AttendanceChartDTO> attendance = dashboardService.getAttendanceChart(days);
        return ResponseEntity.ok(ApiResponse.success("Attendance chart fetched successfully", attendance));
    }

    @GetMapping("/recent-activities")
    @Operation(summary = "Get recent activities", description = "Get recent activities in the school")
    public ResponseEntity<ApiResponse<List<RecentActivityDTO>>> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        List<RecentActivityDTO> activities = dashboardService.getRecentActivities(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent activities fetched successfully", activities));
    }

    @GetMapping("/subscription-info")
    @Operation(summary = "Get subscription info", description = "Get current subscription information")
    public ResponseEntity<ApiResponse<SubscriptionInfoDTO>> getSubscriptionInfo() {
        SubscriptionInfoDTO subscriptionInfo = dashboardService.getSubscriptionInfo();
        return ResponseEntity.ok(ApiResponse.success("Subscription info fetched successfully", subscriptionInfo));
    }
}
