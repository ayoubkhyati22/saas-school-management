package com.school.saas.module.issue.service;

import com.school.saas.common.Role;
import com.school.saas.module.issue.dto.*;
import com.school.saas.module.issue.entity.*;
import com.school.saas.module.issue.mapper.IssueCommentMapper;
import com.school.saas.module.issue.mapper.IssueMapper;
import com.school.saas.module.issue.repository.IssueCommentRepository;
import com.school.saas.module.issue.repository.IssueRepository;
import com.school.saas.module.notification.dto.CreateNotificationRequest;
import com.school.saas.module.notification.entity.NotificationType;
import com.school.saas.module.notification.service.NotificationService;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import com.school.saas.security.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final IssueCommentRepository issueCommentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final IssueMapper issueMapper;
    private final IssueCommentMapper issueCommentMapper;

    @Override
    @Transactional
    public IssueDTO createIssue(CreateIssueRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        UUID currentUserId = TenantContext.getCurrentUserId();

        Issue issue = Issue.builder()
                .schoolId(schoolId)
                .reportedBy(currentUserId)
                .title(request.getTitle())
                .description(request.getDescription())
                .issueType(request.getIssueType())
                .priority(request.getPriority())
                .status(IssueStatus.OPEN)
                .build();

        issue = issueRepository.save(issue);

        // Auto-notify all SUPER_ADMINs
        notifySuperAdmins(issue);

        log.info("Created issue: {} for school: {}", issue.getId(), schoolId);

        return issueMapper.toDTO(issue);
    }

    @Override
    @Transactional
    public IssueDTO updateIssue(UUID id, UpdateIssueRequest request) {
        Issue issue = getIssueAndValidateAccess(id);

        if (request.getTitle() != null) {
            issue.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            issue.setDescription(request.getDescription());
        }
        if (request.getIssueType() != null) {
            issue.setIssueType(request.getIssueType());
        }
        if (request.getPriority() != null) {
            issue.setPriority(request.getPriority());
        }

        issue = issueRepository.save(issue);
        return issueMapper.toDTO(issue);
    }

    @Override
    @Transactional
    public IssueDTO assignIssue(UUID id, AssignIssueRequest request) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Issue not found"));

        // Verify that the assignee is a SUPER_ADMIN
        User assignee = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (assignee.getRole() != Role.SUPER_ADMIN) {
            throw new IllegalArgumentException("Issues can only be assigned to SUPER_ADMIN users");
        }

        issue.setAssignedTo(request.getAssignedTo());
        if (issue.getStatus() == IssueStatus.OPEN) {
            issue.setStatus(IssueStatus.IN_PROGRESS);
        }

        issue = issueRepository.save(issue);

        // Notify the assigned super admin
        notificationService.sendNotification(CreateNotificationRequest.builder()
                .userId(request.getAssignedTo())
                .title("Issue Assigned: " + issue.getTitle())
                .message("You have been assigned to issue #" + issue.getId())
                .notificationType(NotificationType.INFO)
                .build());

        log.info("Assigned issue: {} to user: {}", id, request.getAssignedTo());

        return issueMapper.toDTO(issue);
    }

    @Override
    @Transactional
    public IssueDTO changeStatus(UUID id, IssueStatus status) {
        Issue issue = getIssueAndValidateAccess(id);

        issue.setStatus(status);

        if (status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED) {
            issue.setResolvedAt(LocalDateTime.now());
        }

        issue = issueRepository.save(issue);

        // Notify the reporter about status change
        notificationService.sendNotification(CreateNotificationRequest.builder()
                .userId(issue.getReportedBy())
                .title("Issue Status Updated: " + issue.getTitle())
                .message("Issue status changed to: " + status)
                .notificationType(NotificationType.INFO)
                .build());

        return issueMapper.toDTO(issue);
    }

    @Override
    @Transactional
    public IssueDTO resolveIssue(UUID id, ResolveIssueRequest request) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Issue not found"));

        issue.setStatus(IssueStatus.RESOLVED);
        issue.setResolution(request.getResolution());
        issue.setResolvedAt(LocalDateTime.now());

        issue = issueRepository.save(issue);

        // Notify the reporter about resolution
        notificationService.sendNotification(CreateNotificationRequest.builder()
                .userId(issue.getReportedBy())
                .title("Issue Resolved: " + issue.getTitle())
                .message("Your issue has been resolved. Resolution: " + request.getResolution())
                .notificationType(NotificationType.SUCCESS)
                .build());

        log.info("Resolved issue: {}", id);

        return issueMapper.toDTO(issue);
    }

    @Override
    @Transactional
    public void deleteIssue(UUID id) {
        Issue issue = getIssueAndValidateAccess(id);
        issueRepository.delete(issue);
        log.info("Deleted issue: {}", id);
    }

    @Override
    public IssueDTO getIssueById(UUID id) {
        Issue issue = getIssueAndValidateAccess(id);
        return issueMapper.toDTO(issue);
    }

    @Override
    public List<IssueDTO> getIssuesBySchool(UUID schoolId) {
        // Verify access
        UUID currentSchoolId = TenantContext.getTenantId();
        if (!currentSchoolId.equals(schoolId)) {
            throw new IllegalArgumentException("Cannot access issues from another school");
        }

        List<Issue> issues = issueRepository.findBySchoolId(schoolId);
        return issues.stream()
                .map(issueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<IssueDTO> getIssuesByStatus(IssueStatus status) {
        UUID schoolId = TenantContext.getTenantId();

        List<Issue> issues = issueRepository.findBySchoolIdAndStatus(schoolId, status);
        return issues.stream()
                .map(issueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<IssueDTO> getIssuesByPriority(IssuePriority priority) {
        UUID schoolId = TenantContext.getTenantId();

        List<Issue> issues = issueRepository.findBySchoolIdAndPriority(schoolId, priority);
        return issues.stream()
                .map(issueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<IssueDTO> getIssuesAssignedToUser(UUID userId) {
        List<Issue> issues = issueRepository.findByAssignedTo(userId);
        return issues.stream()
                .map(issueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IssueCommentDTO addComment(UUID issueId, AddCommentRequest request) {
        UUID currentUserId = TenantContext.getCurrentUserId();

        Issue issue = getIssueAndValidateAccess(issueId);

        IssueComment comment = IssueComment.builder()
                .issue(issue)
                .userId(currentUserId)
                .comment(request.getComment())
                .build();

        comment = issueCommentRepository.save(comment);

        // Notify relevant parties (reporter and assignee if different from commenter)
        if (!issue.getReportedBy().equals(currentUserId)) {
            notificationService.sendNotification(CreateNotificationRequest.builder()
                    .userId(issue.getReportedBy())
                    .title("New Comment on Issue: " + issue.getTitle())
                    .message("A new comment has been added to your issue")
                    .notificationType(NotificationType.INFO)
                    .build());
        }

        if (issue.getAssignedTo() != null && !issue.getAssignedTo().equals(currentUserId)) {
            notificationService.sendNotification(CreateNotificationRequest.builder()
                    .userId(issue.getAssignedTo())
                    .title("New Comment on Assigned Issue: " + issue.getTitle())
                    .message("A new comment has been added to an issue assigned to you")
                    .notificationType(NotificationType.INFO)
                    .build());
        }

        log.info("Added comment to issue: {}", issueId);

        return issueCommentMapper.toDTO(comment);
    }

    @Override
    public List<IssueCommentDTO> getCommentsByIssue(UUID issueId) {
        getIssueAndValidateAccess(issueId);

        List<IssueComment> comments = issueCommentRepository.findByIssueIdOrderByCreatedAtAsc(issueId);
        return comments.stream()
                .map(issueCommentMapper::toDTO)
                .collect(Collectors.toList());
    }

    private Issue getIssueAndValidateAccess(UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Issue not found"));

        UUID schoolId = TenantContext.getTenantId();
        if (!issue.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Issue does not belong to this school");
        }

        return issue;
    }

    private void notifySuperAdmins(Issue issue) {
        try {
            // Find all SUPER_ADMIN users
            List<User> superAdmins = userRepository.findByRole(Role.SUPER_ADMIN);

            for (User superAdmin : superAdmins) {
                notificationService.sendNotification(CreateNotificationRequest.builder()
                        .userId(superAdmin.getId())
                        .title("New Issue Reported: " + issue.getTitle())
                        .message("A new " + issue.getPriority() + " priority issue has been reported: " +
                                issue.getDescription())
                        .notificationType(NotificationType.WARNING)
                        .build());
            }

            log.info("Notified {} super admins about new issue: {}", superAdmins.size(), issue.getId());
        } catch (Exception e) {
            log.error("Failed to notify super admins about issue: {}", issue.getId(), e);
            // Don't fail the issue creation if notification fails
        }
    }
}
