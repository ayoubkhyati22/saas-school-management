package com.school.saas.module.scheduler;

import com.school.saas.module.issue.entity.IssueStatus;
import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.notification.entity.NotificationType;
import com.school.saas.module.payment.entity.PaymentStatus;
import com.school.saas.common.Role;
import com.school.saas.common.SubscriptionStatus;
import com.school.saas.module.absence.repository.AbsenceRepository;
import com.school.saas.module.document.repository.DocumentRepository;
import com.school.saas.module.issue.entity.Issue;
import com.school.saas.module.issue.repository.IssueRepository;
import com.school.saas.module.notification.dto.CreateNotificationRequest;
import com.school.saas.module.notification.service.NotificationService;
import com.school.saas.module.payment.entity.Payment;
import com.school.saas.module.payment.repository.PaymentRepository;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.subscription.Subscription;
import com.school.saas.module.subscription.SubscriptionRepository;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;
    private final DocumentRepository documentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final ZoneId DEFAULT_ZONE = ZoneId.systemDefault();

    /**
     * Check subscription expiration daily at midnight
     * - Find subscriptions expiring in 7 days, send warnings
     * - Find expired subscriptions, update status and send notifications
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void checkSubscriptionExpiration() {
        log.info("Starting scheduled task: checkSubscriptionExpiration");

        try {
            LocalDate today = LocalDate.now(DEFAULT_ZONE);
            LocalDate warningDate = today.plusDays(7);

            // Find subscriptions expiring in 7 days
            List<Subscription> expiringSoon = subscriptionRepository.findExpiringSoon(warningDate);
            log.info("Found {} subscriptions expiring within 7 days", expiringSoon.size());

            for (Subscription subscription : expiringSoon) {
                try {
                    long daysRemaining = ChronoUnit.DAYS.between(today, subscription.getEndDate());

                    if (daysRemaining <= 7 && daysRemaining > 0) {
                        // Send warning notification to school admins
                        List<User> schoolAdmins = userRepository.findBySchoolIdAndRole(
                            subscription.getSchool().getId(),
                            Role.SCHOOL_ADMIN
                        );

                        for (User admin : schoolAdmins) {
                            CreateNotificationRequest notification = CreateNotificationRequest.builder()
                                .userId(admin.getId())
                                .title("Subscription Expiring Soon")
                                .message(String.format(
                                    "Your subscription (%s) will expire in %d days on %s. Please renew to avoid service interruption.",
                                    subscription.getSubscriptionPlan().getName(),
                                    daysRemaining,
                                    subscription.getEndDate().format(DATE_FORMATTER)
                                ))
                                .notificationType(NotificationType.valueOf("SUBSCRIPTION_WARNING"))
                                .build();

                            notificationService.sendNotification(notification);
                        }

                        log.info("Sent expiration warning for subscription: {} (School: {})",
                                subscription.getId(), subscription.getSchool().getName());
                    }
                } catch (Exception e) {
                    log.error("Failed to send expiration warning for subscription: {}", subscription.getId(), e);
                }
            }

            // Find and update expired subscriptions
            List<Subscription> expired = subscriptionRepository.findExpired(today);
            log.info("Found {} expired subscriptions", expired.size());

            for (Subscription subscription : expired) {
                try {
                    subscription.setStatus(SubscriptionStatus.EXPIRED);
                    subscriptionRepository.save(subscription);

                    // Send expiration notification
                    List<User> schoolAdmins = userRepository.findBySchoolIdAndRole(
                        subscription.getSchool().getId(),
                        Role.SCHOOL_ADMIN
                    );

                    for (User admin : schoolAdmins) {
                        CreateNotificationRequest notification = CreateNotificationRequest.builder()
                            .userId(admin.getId())
                            .title("Subscription Expired")
                            .message(String.format(
                                "Your subscription (%s) has expired on %s. Please renew immediately to restore access.",
                                subscription.getSubscriptionPlan().getName(),
                                subscription.getEndDate().format(DATE_FORMATTER)
                            ))
                            .notificationType(NotificationType.valueOf("SUBSCRIPTION_EXPIRED"))
                            .build();

                        notificationService.sendNotification(notification);
                    }

                    log.info("Marked subscription as expired: {} (School: {})",
                            subscription.getId(), subscription.getSchool().getName());
                } catch (Exception e) {
                    log.error("Failed to process expired subscription: {}", subscription.getId(), e);
                }
            }

            log.info("Completed scheduled task: checkSubscriptionExpiration");
        } catch (Exception e) {
            log.error("Error in checkSubscriptionExpiration task", e);
        }
    }

    /**
     * Send payment reminders daily at 8 AM
     * - Find payments due in 3 days, send reminders
     * - Find overdue payments, send overdue notices
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void sendPaymentReminders() {
        log.info("Starting scheduled task: sendPaymentReminders");

        try {
            LocalDate today = LocalDate.now(DEFAULT_ZONE);
            LocalDate reminderDate = today.plusDays(3);

            // Get all schools with pending payments
            List<Payment> pendingPayments = paymentRepository.findBySchoolIdAndStatus(null, PaymentStatus.PENDING)
                .stream()
                .filter(p -> p.getDueDate() != null)
                .collect(Collectors.toList());

            log.info("Processing {} pending payments", pendingPayments.size());

            // Send reminders for payments due in 3 days
            for (Payment payment : pendingPayments) {
                try {
                    if (payment.getDueDate().equals(reminderDate)) {
                        // Send reminder to student's parents/guardians
                        UUID studentId = payment.getStudent().getId();
                        UUID studentUserId = payment.getStudent().getUser().getId();

                        CreateNotificationRequest notification = CreateNotificationRequest.builder()
                            .userId(studentUserId)
                            .title("Payment Due Soon")
                            .message(String.format(
                                "Payment reminder: %s payment of $%.2f is due on %s (in 3 days). Invoice: %s",
                                payment.getPaymentType(),
                                payment.getAmount(),
                                payment.getDueDate().format(DATE_FORMATTER),
                                payment.getInvoiceNumber()
                            ))
                            .notificationType(NotificationType.valueOf("PAYMENT_REMINDER"))
                            .build();

                        notificationService.sendNotification(notification);
                        log.debug("Sent payment reminder for invoice: {}", payment.getInvoiceNumber());
                    }
                } catch (Exception e) {
                    log.error("Failed to send payment reminder for invoice: {}", payment.getInvoiceNumber(), e);
                }
            }

            // Send overdue notices
            List<Payment> overduePayments = paymentRepository.findOverdue(null, today, PaymentStatus.PAID)
                .stream()
                .filter(p -> p.getSchoolId() != null)
                .collect(Collectors.toList());

            log.info("Processing {} overdue payments", overduePayments.size());

            for (Payment payment : overduePayments) {
                try {
                    long daysOverdue = ChronoUnit.DAYS.between(payment.getDueDate(), today);
                    UUID studentUserId = payment.getStudent().getUser().getId();

                    CreateNotificationRequest notification = CreateNotificationRequest.builder()
                        .userId(studentUserId)
                        .title("Payment Overdue")
                        .message(String.format(
                            "OVERDUE: %s payment of $%.2f was due on %s (%d days overdue). Please pay immediately. Invoice: %s",
                            payment.getPaymentType(),
                            payment.getAmount(),
                            payment.getDueDate().format(DATE_FORMATTER),
                            daysOverdue,
                            payment.getInvoiceNumber()
                        ))
                        .notificationType(NotificationType.valueOf("PAYMENT_OVERDUE"))
                        .build();

                    notificationService.sendNotification(notification);

                    // Also notify school admin
                    List<User> schoolAdmins = userRepository.findBySchoolIdAndRole(
                        payment.getSchoolId(),
                        Role.SCHOOL_ADMIN
                    );

                    for (User admin : schoolAdmins) {
                        CreateNotificationRequest adminNotification = CreateNotificationRequest.builder()
                            .userId(admin.getId())
                            .title("Overdue Payment Alert")
                            .message(String.format(
                                "Student %s %s has overdue payment of $%.2f (%d days). Invoice: %s",
                                payment.getStudent().getUser().getFirstName(),
                                payment.getStudent().getUser().getLastName(),
                                payment.getAmount(),
                                daysOverdue,
                                payment.getInvoiceNumber()
                            ))
                            .notificationType(NotificationType.valueOf("PAYMENT_OVERDUE_ALERT"))
                            .build();

                        notificationService.sendNotification(adminNotification);
                    }

                    log.debug("Sent overdue notice for invoice: {}", payment.getInvoiceNumber());
                } catch (Exception e) {
                    log.error("Failed to send overdue notice for invoice: {}", payment.getInvoiceNumber(), e);
                }
            }

            log.info("Completed scheduled task: sendPaymentReminders");
        } catch (Exception e) {
            log.error("Error in sendPaymentReminders task", e);
        }
    }

    /**
     * Generate weekly attendance report every Monday at 9 AM
     * - Generate attendance summary for previous week
     * - Send to school admins and teachers
     */
    @Scheduled(cron = "0 0 9 * * MON")
    @Transactional(readOnly = true)
    public void generateWeeklyAttendanceReport() {
        log.info("Starting scheduled task: generateWeeklyAttendanceReport");

        try {
            LocalDate today = LocalDate.now(DEFAULT_ZONE);
            LocalDate weekStart = today.minusDays(7);
            LocalDate weekEnd = today.minusDays(1);

            // Get all schools
            List<UUID> schoolIds = studentRepository.findAll().stream()
                .map(student -> student.getSchoolId())
                .distinct()
                .collect(Collectors.toList());

            log.info("Generating attendance reports for {} schools", schoolIds.size());

            for (UUID schoolId : schoolIds) {
                try {
                    // Get attendance data for the week
                    List<com.school.saas.module.absence.entity.Absence> weeklyAbsences =
                        absenceRepository.findBySchoolIdAndDateBetween(schoolId, weekStart, weekEnd);

                    long totalStudents = studentRepository.countBySchoolId(schoolId);
                    long totalAbsences = weeklyAbsences.size();
                    long totalPossibleAttendance = totalStudents * 7; // 7 days
                    double attendanceRate = totalPossibleAttendance > 0
                        ? ((totalPossibleAttendance - totalAbsences) * 100.0 / totalPossibleAttendance)
                        : 0.0;

                    // Create report message
                    String reportMessage = String.format(
                        "Weekly Attendance Report (%s to %s):\n\n" +
                        "Total Students: %d\n" +
                        "Total Absences: %d\n" +
                        "Attendance Rate: %.2f%%\n\n" +
                        "Please review attendance records and follow up on excessive absences.",
                        weekStart.format(DATE_FORMATTER),
                        weekEnd.format(DATE_FORMATTER),
                        totalStudents,
                        totalAbsences,
                        attendanceRate
                    );

                    // Send to school admins
                    List<User> schoolAdmins = userRepository.findBySchoolIdAndRole(schoolId, Role.SCHOOL_ADMIN);
                    for (User admin : schoolAdmins) {
                        CreateNotificationRequest notification = CreateNotificationRequest.builder()
                            .userId(admin.getId())
                            .title("Weekly Attendance Report")
                            .message(reportMessage)
                            .notificationType(NotificationType.valueOf("ATTENDANCE_REPORT"))
                            .build();

                        notificationService.sendNotification(notification);
                    }

                    // Send to teachers
                    List<User> teachers = userRepository.findBySchoolIdAndRole(schoolId, Role.TEACHER);
                    for (User teacher : teachers) {
                        CreateNotificationRequest notification = CreateNotificationRequest.builder()
                            .userId(teacher.getId())
                            .title("Weekly Attendance Report")
                            .message(reportMessage)
                            .notificationType(NotificationType.valueOf("ATTENDANCE_REPORT"))
                            .build();

                        notificationService.sendNotification(notification);
                    }

                    log.info("Sent attendance report for school: {}", schoolId);
                } catch (Exception e) {
                    log.error("Failed to generate attendance report for school: {}", schoolId, e);
                }
            }

            log.info("Completed scheduled task: generateWeeklyAttendanceReport");
        } catch (Exception e) {
            log.error("Error in generateWeeklyAttendanceReport task", e);
        }
    }

    /**
     * Calculate storage usage daily at 2 AM
     * - Calculate storage used per school
     * - Update subscription usage metrics
     * - Alert schools nearing storage limit
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void calculateStorageUsage() {
        log.info("Starting scheduled task: calculateStorageUsage");

        try {
            // Get all schools
            List<UUID> schoolIds = studentRepository.findAll().stream()
                .map(student -> student.getSchoolId())
                .distinct()
                .collect(Collectors.toList());

            log.info("Calculating storage usage for {} schools", schoolIds.size());

            for (UUID schoolId : schoolIds) {
                try {
                    // Calculate total storage used (in bytes)
                    Long storageUsedBytes = documentRepository.sumFileSizeBySchoolId(schoolId);
                    double storageUsedGB = storageUsedBytes / (1024.0 * 1024.0 * 1024.0);

                    // Get storage limit from subscription
                    Optional<Subscription> activeSubscription = subscriptionRepository.findActiveBySchoolId(schoolId);

                    if (activeSubscription.isPresent()) {
                        // Default storage limit (would come from subscription plan features)
                        double storageLimitGB = 10.0; // Default 10 GB

                        // Check if nearing limit (>80%)
                        double usagePercentage = (storageUsedGB / storageLimitGB) * 100.0;

                        if (usagePercentage >= 80.0) {
                            // Send alert to school admins
                            List<User> schoolAdmins = userRepository.findBySchoolIdAndRole(schoolId, Role.SCHOOL_ADMIN);

                            for (User admin : schoolAdmins) {
                                CreateNotificationRequest notification = CreateNotificationRequest.builder()
                                    .userId(admin.getId())
                                    .title("Storage Limit Warning")
                                    .message(String.format(
                                        "Your school is using %.2f GB of %.2f GB storage (%.1f%%). " +
                                        "Please delete unnecessary files or upgrade your subscription plan.",
                                        storageUsedGB,
                                        storageLimitGB,
                                        usagePercentage
                                    ))
                                    .notificationType(NotificationType.valueOf("STORAGE_WARNING"))
                                    .build();

                                notificationService.sendNotification(notification);
                            }

                            log.info("Sent storage warning for school: {} (usage: {:.2f}%)", schoolId, usagePercentage);
                        }

                        log.debug("Storage usage for school {}: {:.2f} GB / {:.2f} GB ({:.1f}%)",
                                schoolId, storageUsedGB, storageLimitGB, usagePercentage);
                    }
                } catch (Exception e) {
                    log.error("Failed to calculate storage for school: {}", schoolId, e);
                }
            }

            log.info("Completed scheduled task: calculateStorageUsage");
        } catch (Exception e) {
            log.error("Error in calculateStorageUsage task", e);
        }
    }

    /**
     * Auto-assign critical issues every 15 minutes
     * - Find unassigned CRITICAL issues
     * - Auto-assign to least-busy SUPER_ADMIN
     * - Send notification
     */
    @Scheduled(cron = "0 */15 * * * *")
    @Transactional
    public void autoAssignIssues() {
        log.info("Starting scheduled task: autoAssignIssues");

        try {
            // Find unassigned CRITICAL issues
            List<Issue> unassignedCritical = issueRepository.findByStatus(IssueStatus.OPEN).stream()
                .filter(issue -> issue.getAssignedTo() == null && issue.getPriority() == IssuePriority.CRITICAL)
                .collect(Collectors.toList());

            if (unassignedCritical.isEmpty()) {
                log.debug("No unassigned critical issues found");
                return;
            }

            log.info("Found {} unassigned critical issues", unassignedCritical.size());

            // Get all SUPER_ADMINs
            List<User> superAdmins = userRepository.findByRole(Role.SUPER_ADMIN);

            if (superAdmins.isEmpty()) {
                log.warn("No super admins available for issue assignment");
                return;
            }

            // Calculate workload for each super admin (count assigned issues)
            Map<UUID, Long> workloadMap = new HashMap<>();
            for (User admin : superAdmins) {
                long assignedCount = issueRepository.findByAssignedToAndStatus(admin.getId(), IssueStatus.OPEN).size() +
                                   issueRepository.findByAssignedToAndStatus(admin.getId(), IssueStatus.IN_PROGRESS).size();
                workloadMap.put(admin.getId(), assignedCount);
            }

            // Auto-assign issues to least busy admin
            for (Issue issue : unassignedCritical) {
                try {
                    // Find admin with least workload
                    UUID leastBusyAdminId = workloadMap.entrySet().stream()
                        .min(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse(superAdmins.get(0).getId());

                    // Assign issue
                    issue.setAssignedTo(leastBusyAdminId);
                    issue.setStatus(IssueStatus.IN_PROGRESS);
                    issueRepository.save(issue);

                    // Update workload
                    workloadMap.put(leastBusyAdminId, workloadMap.get(leastBusyAdminId) + 1);

                    // Send notification to assigned admin
                    CreateNotificationRequest notification = CreateNotificationRequest.builder()
                        .userId(leastBusyAdminId)
                        .title("Critical Issue Auto-Assigned")
                        .message(String.format(
                            "You have been auto-assigned a CRITICAL issue: %s. Please address it immediately.",
                            issue.getTitle()
                        ))
                        .notificationType(NotificationType.valueOf("ISSUE_ASSIGNED"))
                        .build();

                    notificationService.sendNotification(notification);

                    log.info("Auto-assigned critical issue {} to super admin {}", issue.getId(), leastBusyAdminId);
                } catch (Exception e) {
                    log.error("Failed to auto-assign issue: {}", issue.getId(), e);
                }
            }

            log.info("Completed scheduled task: autoAssignIssues");
        } catch (Exception e) {
            log.error("Error in autoAssignIssues task", e);
        }
    }
}
