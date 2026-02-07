package com.school.saas.module.issue.controller;

import com.school.saas.module.issue.dto.*;
import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueStatus;
import com.school.saas.module.issue.service.IssueService;
import com.school.saas.security.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Tag(name = "Issue", description = "Issue management endpoints")
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    @PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new issue", description = "School admins can create issues")
    public ResponseEntity<IssueDTO> createIssue(@Valid @RequestBody CreateIssueRequest request) {
        IssueDTO issue = issueService.createIssue(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(issue);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Update an issue")
    public ResponseEntity<IssueDTO> updateIssue(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIssueRequest request) {
        IssueDTO issue = issueService.updateIssue(id, request);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @Operation(summary = "Assign issue to a super admin", description = "Only super admins can assign issues")
    public ResponseEntity<IssueDTO> assignIssue(
            @PathVariable UUID id,
            @Valid @RequestBody AssignIssueRequest request) {
        IssueDTO issue = issueService.assignIssue(id, request);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Change issue status")
    public ResponseEntity<IssueDTO> changeStatus(
            @PathVariable UUID id,
            @RequestParam IssueStatus status) {
        IssueDTO issue = issueService.changeStatus(id, status);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @Operation(summary = "Resolve an issue", description = "Only super admins can resolve issues")
    public ResponseEntity<IssueDTO> resolveIssue(
            @PathVariable UUID id,
            @Valid @RequestBody ResolveIssueRequest request) {
        IssueDTO issue = issueService.resolveIssue(id, request);
        return ResponseEntity.ok(issue);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Delete an issue")
    public ResponseEntity<Void> deleteIssue(@PathVariable UUID id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get issue by ID")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable UUID id) {
        IssueDTO issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get issues", description = "School admins see their school's issues, super admins see all")
    public ResponseEntity<List<IssueDTO>> getIssues(
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) IssuePriority priority) {

        UUID schoolId = TenantContext.getTenantId();

        if (status != null) {
            return ResponseEntity.ok(issueService.getIssuesByStatus(status));
        } else if (priority != null) {
            return ResponseEntity.ok(issueService.getIssuesByPriority(priority));
        } else {
            return ResponseEntity.ok(issueService.getIssuesBySchool(schoolId));
        }
    }

    @GetMapping("/assigned-to-me")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @Operation(summary = "Get issues assigned to current user", description = "For super admins")
    public ResponseEntity<List<IssueDTO>> getIssuesAssignedToMe() {
        UUID currentUserId = TenantContext.getCurrentUserId();
        List<IssueDTO> issues = issueService.getIssuesAssignedToUser(currentUserId);
        return ResponseEntity.ok(issues);
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Add a comment to an issue")
    public ResponseEntity<IssueCommentDTO> addComment(
            @PathVariable UUID id,
            @Valid @RequestBody AddCommentRequest request) {
        IssueCommentDTO comment = issueService.addComment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get comments for an issue")
    public ResponseEntity<List<IssueCommentDTO>> getCommentsByIssue(@PathVariable UUID id) {
        List<IssueCommentDTO> comments = issueService.getCommentsByIssue(id);
        return ResponseEntity.ok(comments);
    }
}
