package com.school.saas.module.dashboard.service;

import com.school.saas.module.dashboard.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SuperAdminDashboardService {

    SuperAdminDashboardDTO getOverview();

    List<RevenueTrendDTO> getRevenueTrend(int months);

    List<NewSchoolsDTO> getNewSchools(int months);

    List<SubscriptionDistributionDTO> getSubscriptionDistribution();

    Page<SchoolListItemDTO> getAllSchools(Pageable pageable);

    List<IssueOverviewDTO> getOpenIssues();
}
