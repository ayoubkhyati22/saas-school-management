package com.school.saas.module.dashboard.service;

import com.school.saas.common.StudentStatus;
import com.school.saas.module.payment.entity.PaymentStatus;
import com.school.saas.module.absence.repository.AbsenceRepository;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.course.repository.CourseRepository;
import com.school.saas.module.dashboard.dto.*;
import com.school.saas.module.document.repository.DocumentRepository;
import com.school.saas.module.payment.repository.PaymentRepository;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.subscription.SubscriptionRepository;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.security.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SchoolAdminDashboardServiceImpl implements SchoolAdminDashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;
    private final CourseRepository courseRepository;
    private final PaymentRepository paymentRepository;
    private final AbsenceRepository absenceRepository;
    private final DocumentRepository documentRepository;
    private final SubscriptionRepository subscriptionRepository;

    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("MMM yyyy");

    @Override
    public SchoolAdminDashboardDTO getOverview() {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Fetching dashboard overview for school: {}", schoolId);

        // Count students, teachers, classes, courses
        long totalStudents = studentRepository.countBySchoolId(schoolId);
        long totalTeachers = teacherRepository.countBySchoolId(schoolId);
        long totalClasses = classRoomRepository.countBySchoolId(schoolId);
        long totalCourses = courseRepository.countBySchoolId(schoolId);

        // Active/Inactive students
        long activeStudents = studentRepository.countBySchoolIdAndStatus(schoolId, StudentStatus.valueOf("ACTIVE"));
        long inactiveStudents = totalStudents - activeStudents;

        // Pending payments
        List<com.school.saas.module.payment.entity.Payment> pendingPayments =
            paymentRepository.findBySchoolIdAndStatus(schoolId, PaymentStatus.PENDING);
        long pendingPaymentsCount = pendingPayments.size();
        BigDecimal pendingPaymentsAmount = pendingPayments.stream()
            .map(com.school.saas.module.payment.entity.Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Overdue payments
        List<com.school.saas.module.payment.entity.Payment> overduePayments =
            paymentRepository.findOverdue(schoolId, LocalDate.now(), PaymentStatus.PAID);
        long overduePaymentsCount = overduePayments.size();
        BigDecimal overduePaymentsAmount = overduePayments.stream()
            .map(com.school.saas.module.payment.entity.Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate attendance rate (last 30 days)
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        List<com.school.saas.module.absence.entity.Absence> absences =
            absenceRepository.findBySchoolIdAndDateBetween(schoolId, startDate, endDate);

        // Assuming total possible attendance = totalStudents * 30 days
        long totalPossibleAttendance = totalStudents * 30;
        long totalAbsences = absences.size();
        long totalPresent = totalPossibleAttendance - totalAbsences;
        double attendanceRate = totalPossibleAttendance > 0
            ? (totalPresent * 100.0 / totalPossibleAttendance)
            : 0.0;

        // Storage usage (convert bytes to GB)
        Long storageUsedBytes = documentRepository.sumFileSizeBySchoolId(schoolId);
        double storageUsedGB = storageUsedBytes / (1024.0 * 1024.0 * 1024.0);

        // Get storage limit from subscription
        double storageLimit = 10.0; // Default 10 GB
        subscriptionRepository.findActiveBySchoolId(schoolId).ifPresent(subscription -> {
            // Storage limit would come from subscription plan features
            // For now, using default
        });

        return SchoolAdminDashboardDTO.builder()
            .totalStudents(totalStudents)
            .totalTeachers(totalTeachers)
            .totalClasses(totalClasses)
            .totalCourses(totalCourses)
            .activeStudents(activeStudents)
            .inactiveStudents(inactiveStudents)
            .pendingPaymentsCount(pendingPaymentsCount)
            .pendingPaymentsAmount(pendingPaymentsAmount.setScale(2, RoundingMode.HALF_UP))
            .overduePaymentsCount(overduePaymentsCount)
            .overduePaymentsAmount(overduePaymentsAmount.setScale(2, RoundingMode.HALF_UP))
            .attendanceRate(Math.round(attendanceRate * 100.0) / 100.0)
            .storageUsed(Math.round(storageUsedGB * 100.0) / 100.0)
            .storageLimit(storageLimit)
            .build();
    }

    @Override
    public List<EnrollmentTrendDTO> getEnrollmentTrend(int months) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Fetching enrollment trend for {} months for school: {}", months, schoolId);

        List<EnrollmentTrendDTO> trends = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Get all students for the school
        List<com.school.saas.module.student.Student> allStudents = studentRepository.findBySchoolId(schoolId);

        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDate monthStart = targetMonth.atDay(1);
            LocalDate monthEnd = targetMonth.atEndOfMonth();

            // Count students enrolled in this month
            long count = allStudents.stream()
                .filter(student -> {
                    LocalDate enrollmentDate = student.getEnrollmentDate();
                    return enrollmentDate != null &&
                           !enrollmentDate.isBefore(monthStart) &&
                           !enrollmentDate.isAfter(monthEnd);
                })
                .count();

            trends.add(EnrollmentTrendDTO.builder()
                .month(targetMonth.format(MONTH_FORMATTER))
                .count(count)
                .build());
        }

        return trends;
    }

    @Override
    public List<PaymentCollectionDTO> getPaymentCollection(int months) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Fetching payment collection for {} months for school: {}", months, schoolId);

        List<PaymentCollectionDTO> collections = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Get all paid payments
        List<com.school.saas.module.payment.entity.Payment> allPayments =
            paymentRepository.findBySchoolIdAndStatus(schoolId, PaymentStatus.PAID);

        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDate monthStart = targetMonth.atDay(1);
            LocalDate monthEnd = targetMonth.atEndOfMonth();

            // Sum payments collected in this month
            BigDecimal totalAmount = allPayments.stream()
                .filter(payment -> {
                    LocalDate paidDate = payment.getPaidDate();
                    return paidDate != null &&
                           !paidDate.isBefore(monthStart) &&
                           !paidDate.isAfter(monthEnd);
                })
                .map(com.school.saas.module.payment.entity.Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            collections.add(PaymentCollectionDTO.builder()
                .month(targetMonth.format(MONTH_FORMATTER))
                .amount(totalAmount.setScale(2, RoundingMode.HALF_UP))
                .type("ALL")
                .build());
        }

        return collections;
    }

    @Override
    public List<AttendanceChartDTO> getAttendanceChart(int days) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Fetching attendance chart for {} days for school: {}", days, schoolId);

        List<AttendanceChartDTO> chartData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        long totalStudents = studentRepository.countBySchoolId(schoolId);

        for (int i = days - 1; i >= 0; i--) {
            LocalDate targetDate = today.minusDays(i);

            // Count absences for this date
            List<com.school.saas.module.absence.entity.Absence> absences =
                absenceRepository.findBySchoolIdAndDateBetween(schoolId, targetDate, targetDate);
            long absentCount = absences.size();
            long presentCount = totalStudents - absentCount;

            chartData.add(AttendanceChartDTO.builder()
                .date(targetDate)
                .presentCount(Math.max(0, presentCount))
                .absentCount(absentCount)
                .build());
        }

        return chartData;
    }

    @Override
    public List<RecentActivityDTO> getRecentActivities(int limit) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Fetching {} recent activities for school: {}", limit, schoolId);

        List<RecentActivityDTO> activities = new ArrayList<>();

        // Get recent students (limited)
        List<com.school.saas.module.student.Student> recentStudents =
            studentRepository.findBySchoolId(schoolId).stream()
                .sorted((s1, s2) -> s2.getCreatedAt().compareTo(s1.getCreatedAt()))
                .limit(limit / 2)
                .collect(Collectors.toList());

        for (com.school.saas.module.student.Student student : recentStudents) {
            activities.add(RecentActivityDTO.builder()
                .type("NEW_STUDENT")
                .description("New student enrolled: " + student.getUser().getFirstName() + " " +
                           student.getUser().getLastName())
                .timestamp(student.getCreatedAt())
                .build());
        }

        // Get recent payments
        List<com.school.saas.module.payment.entity.Payment> recentPayments =
            paymentRepository.findBySchoolIdAndStatus(schoolId, PaymentStatus.PAID).stream()
                .filter(p -> p.getPaidDate() != null)
                .sorted((p1, p2) -> {
                    if (p1.getPaidDate() == null) return 1;
                    if (p2.getPaidDate() == null) return -1;
                    return p2.getPaidDate().compareTo(p1.getPaidDate());
                })
                .limit(limit / 2)
                .collect(Collectors.toList());

        for (com.school.saas.module.payment.entity.Payment payment : recentPayments) {
            activities.add(RecentActivityDTO.builder()
                .type("PAYMENT_RECEIVED")
                .description("Payment received: " + payment.getPaymentType() + " - $" + payment.getAmount())
                .timestamp(payment.getUpdatedAt())
                .build());
        }

        // Sort all activities by timestamp and limit
        return activities.stream()
            .sorted((a1, a2) -> a2.getTimestamp().compareTo(a1.getTimestamp()))
            .limit(limit)
            .collect(Collectors.toList());
    }

    @Override
    public SubscriptionInfoDTO getSubscriptionInfo() {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Fetching subscription info for school: {}", schoolId);

        return subscriptionRepository.findActiveBySchoolId(schoolId)
            .map(subscription -> {
                long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), subscription.getEndDate());

                // Get features from subscription plan
                List<String> features = subscription.getSubscriptionPlan().getFeatures().stream()
                    .map(feature -> feature.getFeatureType().name())
                    .collect(Collectors.toList());

                return SubscriptionInfoDTO.builder()
                    .planName(subscription.getSubscriptionPlan().getName())
                    .startDate(subscription.getStartDate())
                    .endDate(subscription.getEndDate())
                    .daysRemaining(Math.max(0, daysRemaining))
                    .status(subscription.getStatus().name())
                    .features(features)
                    .build();
            })
            .orElse(SubscriptionInfoDTO.builder()
                .planName("No Active Subscription")
                .status("INACTIVE")
                .daysRemaining(0L)
                .features(new ArrayList<>())
                .build());
    }
}
