package com.school.saas.module.dashboard.service;

import com.school.saas.module.issue.entity.IssueStatus;
import com.school.saas.common.Role;
import com.school.saas.module.dashboard.dto.*;
import com.school.saas.module.document.repository.DocumentRepository;
import com.school.saas.module.issue.repository.IssueRepository;
import com.school.saas.module.school.SchoolRepository;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.subscription.SubscriptionRepository;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SuperAdminDashboardServiceImpl implements SuperAdminDashboardService {

    private final SchoolRepository schoolRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final DocumentRepository documentRepository;

    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("MMM yyyy");

    @Override
    public SuperAdminDashboardDTO getOverview() {
        log.info("Fetching super admin dashboard overview");

        // Count all schools
        long totalSchools = schoolRepository.count();
        long activeSchools = schoolRepository.findByActiveTrue().size();

        // Count all subscriptions
        long totalSubscriptions = subscriptionRepository.count();

        // Calculate total revenue (would need a payment/revenue tracking system)
        // For now, using placeholder
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal monthlyRecurringRevenue = BigDecimal.ZERO;

        // Calculate revenue from all active subscriptions
        List<com.school.saas.module.subscription.Subscription> activeSubscriptions =
            subscriptionRepository.findByStatus(com.school.saas.common.SubscriptionStatus.ACTIVE);

        for (com.school.saas.module.subscription.Subscription sub : activeSubscriptions) {
            BigDecimal price = sub.getSubscriptionPlan().getMonthlyPrice();
            monthlyRecurringRevenue = monthlyRecurringRevenue.add(price);

            // Estimate total revenue (MRR * 12 for yearly estimate)
            totalRevenue = totalRevenue.add(price.multiply(BigDecimal.valueOf(12)));
        }

        // Count all users by role
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalTeachers = userRepository.countByRole(Role.TEACHER);
        long totalAdmins = userRepository.countByRole(Role.SCHOOL_ADMIN);

        // Count issues
        long openIssues = issueRepository.findByStatus(IssueStatus.OPEN).size() +
                         issueRepository.findByStatus(IssueStatus.IN_PROGRESS).size();
        long resolvedIssues = issueRepository.findByStatus(IssueStatus.RESOLVED).size() +
                             issueRepository.findByStatus(IssueStatus.CLOSED).size();

        // Calculate total storage used across all schools (convert bytes to GB)
        List<com.school.saas.module.document.entity.Document> allDocuments = documentRepository.findAll();
        long totalStorageBytes = allDocuments.stream()
            .mapToLong(doc -> doc.getFileSize() != null ? doc.getFileSize() : 0L)
            .sum();
        double totalStorageUsed = totalStorageBytes / (1024.0 * 1024.0 * 1024.0);

        return SuperAdminDashboardDTO.builder()
            .totalSchools(totalSchools)
            .activeSchools(activeSchools)
            .totalSubscriptions(totalSubscriptions)
            .totalRevenue(totalRevenue.setScale(2, RoundingMode.HALF_UP))
            .monthlyRecurringRevenue(monthlyRecurringRevenue.setScale(2, RoundingMode.HALF_UP))
            .totalStudents(totalStudents)
            .totalTeachers(totalTeachers)
            .totalAdmins(totalAdmins)
            .openIssues(openIssues)
            .resolvedIssues(resolvedIssues)
            .totalStorageUsed(Math.round(totalStorageUsed * 100.0) / 100.0)
            .build();
    }

    @Override
    public List<RevenueTrendDTO> getRevenueTrend(int months) {
        log.info("Fetching revenue trend for {} months", months);

        List<RevenueTrendDTO> trends = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Get all subscriptions
        List<com.school.saas.module.subscription.Subscription> allSubscriptions =
            subscriptionRepository.findAll();

        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDate monthStart = targetMonth.atDay(1);
            LocalDate monthEnd = targetMonth.atEndOfMonth();

            // Calculate revenue from subscriptions active in this month
            BigDecimal monthlyRevenue = allSubscriptions.stream()
                .filter(subscription -> {
                    LocalDate startDate = subscription.getStartDate();
                    LocalDate endDate = subscription.getEndDate();
                    // Check if subscription was active during this month
                    return !startDate.isAfter(monthEnd) && !endDate.isBefore(monthStart);
                })
                .map(subscription -> subscription.getSubscriptionPlan().getMonthlyPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            trends.add(RevenueTrendDTO.builder()
                .month(targetMonth.format(MONTH_FORMATTER))
                .amount(monthlyRevenue.setScale(2, RoundingMode.HALF_UP))
                .build());
        }

        return trends;
    }

    @Override
    public List<NewSchoolsDTO> getNewSchools(int months) {
        log.info("Fetching new schools for {} months", months);

        List<NewSchoolsDTO> newSchools = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Get all schools
        List<com.school.saas.module.school.School> allSchools = schoolRepository.findAll();

        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDate monthStart = targetMonth.atDay(1);
            LocalDate monthEnd = targetMonth.atEndOfMonth();

            // Count schools created in this month
            long count = allSchools.stream()
                .filter(school -> {
                    LocalDate createdDate = school.getCreatedAt().toLocalDate();
                    return !createdDate.isBefore(monthStart) && !createdDate.isAfter(monthEnd);
                })
                .count();

            newSchools.add(NewSchoolsDTO.builder()
                .month(targetMonth.format(MONTH_FORMATTER))
                .count(count)
                .build());
        }

        return newSchools;
    }

    @Override
    public List<SubscriptionDistributionDTO> getSubscriptionDistribution() {
        log.info("Fetching subscription distribution");

        // Get all active subscriptions grouped by plan
        List<com.school.saas.module.subscription.Subscription> activeSubscriptions =
            subscriptionRepository.findByStatus(com.school.saas.common.SubscriptionStatus.ACTIVE);

        long totalSubscriptions = activeSubscriptions.size();

        // Group by plan and count
        Map<String, Long> planCounts = activeSubscriptions.stream()
            .collect(Collectors.groupingBy(
                subscription -> subscription.getSubscriptionPlan().getName(),
                Collectors.counting()
            ));

        // Convert to DTOs with percentages
        return planCounts.entrySet().stream()
            .map(entry -> {
                String planName = entry.getKey();
                Long count = entry.getValue();
                double percentage = totalSubscriptions > 0
                    ? (count * 100.0 / totalSubscriptions)
                    : 0.0;

                return SubscriptionDistributionDTO.builder()
                    .planName(planName)
                    .count(count)
                    .percentage(Math.round(percentage * 100.0) / 100.0)
                    .build();
            })
            .sorted((d1, d2) -> Long.compare(d2.getCount(), d1.getCount()))
            .collect(Collectors.toList());
    }

    @Override
    public Page<SchoolListItemDTO> getAllSchools(Pageable pageable) {
        log.info("Fetching all schools with pagination");

        Page<com.school.saas.module.school.School> schoolPage = schoolRepository.findAll(pageable);

        List<SchoolListItemDTO> schoolList = schoolPage.getContent().stream()
            .map(school -> {
                // Get student count for this school
                long studentCount = studentRepository.countBySchoolId(school.getId());

                // Get active subscription
                String planName = "No Plan";
                LocalDate subscriptionEndDate = null;
                String status = school.getActive() ? "ACTIVE" : "INACTIVE";

                Optional<com.school.saas.module.subscription.Subscription> activeSubscription =
                    subscriptionRepository.findActiveBySchoolId(school.getId());

                if (activeSubscription.isPresent()) {
                    planName = activeSubscription.get().getSubscriptionPlan().getName();
                    subscriptionEndDate = activeSubscription.get().getEndDate();
                }

                return SchoolListItemDTO.builder()
                    .id(school.getId())
                    .name(school.getName())
                    .planName(planName)
                    .studentCount(studentCount)
                    .status(status)
                    .subscriptionEndDate(subscriptionEndDate)
                    .build();
            })
            .collect(Collectors.toList());

        return new PageImpl<>(schoolList, pageable, schoolPage.getTotalElements());
    }

    @Override
    public List<IssueOverviewDTO> getOpenIssues() {
        log.info("Fetching open issues overview");

        List<IssueOverviewDTO> overview = new ArrayList<>();

        // Count by status
        for (IssueStatus status : IssueStatus.values()) {
            long count = issueRepository.findByStatus(status).size();
            overview.add(IssueOverviewDTO.builder()
                .status(status.name())
                .count(count)
                .build());
        }

        return overview;
    }
}
