package com.school.saas.module.dashboard.controller;

import com.school.saas.dto.ApiResponse;
import com.school.saas.dto.PageResponse;
import com.school.saas.module.dashboard.dto.*;
import com.school.saas.module.dashboard.service.SuperAdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/super-admin")
@RequiredArgsConstructor
@Tag(name = "Super Admin Dashboard", description = "Super Admin Dashboard APIs")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminDashboardController {

    private final SuperAdminDashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(summary = "Get super admin dashboard overview", description = "Get complete platform overview")
    public ResponseEntity<ApiResponse<SuperAdminDashboardDTO>> getOverview() {
        SuperAdminDashboardDTO overview = dashboardService.getOverview();
        return ResponseEntity.ok(ApiResponse.success("Super admin dashboard overview fetched successfully", overview));
    }

    @GetMapping("/revenue-trend")
    @Operation(summary = "Get revenue trend", description = "Get revenue trend for last N months")
    public ResponseEntity<ApiResponse<List<RevenueTrendDTO>>> getRevenueTrend(
            @RequestParam(defaultValue = "12") int months) {
        List<RevenueTrendDTO> trend = dashboardService.getRevenueTrend(months);
        return ResponseEntity.ok(ApiResponse.success("Revenue trend fetched successfully", trend));
    }

    @GetMapping("/new-schools")
    @Operation(summary = "Get new schools", description = "Get new schools count for last N months")
    public ResponseEntity<ApiResponse<List<NewSchoolsDTO>>> getNewSchools(
            @RequestParam(defaultValue = "6") int months) {
        List<NewSchoolsDTO> newSchools = dashboardService.getNewSchools(months);
        return ResponseEntity.ok(ApiResponse.success("New schools data fetched successfully", newSchools));
    }

    @GetMapping("/subscription-distribution")
    @Operation(summary = "Get subscription distribution", description = "Get distribution of subscriptions by plan")
    public ResponseEntity<ApiResponse<List<SubscriptionDistributionDTO>>> getSubscriptionDistribution() {
        List<SubscriptionDistributionDTO> distribution = dashboardService.getSubscriptionDistribution();
        return ResponseEntity.ok(ApiResponse.success("Subscription distribution fetched successfully", distribution));
    }

    @GetMapping("/schools")
    @Operation(summary = "Get all schools", description = "Get paginated list of all schools")
    public ResponseEntity<PageResponse<SchoolListItemDTO>> getAllSchools(Pageable pageable) {
        Page<SchoolListItemDTO> schools = dashboardService.getAllSchools(pageable);
        return ResponseEntity.ok(PageResponse.of(schools, "Schools list fetched successfully"));
    }

    @GetMapping("/open-issues")
    @Operation(summary = "Get open issues", description = "Get overview of issues by status")
    public ResponseEntity<ApiResponse<List<IssueOverviewDTO>>> getOpenIssues() {
        List<IssueOverviewDTO> issues = dashboardService.getOpenIssues();
        return ResponseEntity.ok(ApiResponse.success("Issues overview fetched successfully", issues));
    }
}
