package com.school.saas.module.issue.service;

import com.school.saas.module.issue.dto.*;
import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueStatus;

import java.util.List;
import java.util.UUID;

public interface IssueService {

    IssueDTO createIssue(CreateIssueRequest request);

    IssueDTO updateIssue(UUID id, UpdateIssueRequest request);

    IssueDTO assignIssue(UUID id, AssignIssueRequest request);

    IssueDTO changeStatus(UUID id, IssueStatus status);

    IssueDTO resolveIssue(UUID id, ResolveIssueRequest request);

    void deleteIssue(UUID id);

    IssueDTO getIssueById(UUID id);

    List<IssueDTO> getIssuesBySchool(UUID schoolId);

    List<IssueDTO> getIssuesByStatus(IssueStatus status);

    List<IssueDTO> getIssuesByPriority(IssuePriority priority);

    List<IssueDTO> getIssuesAssignedToUser(UUID userId);

    IssueCommentDTO addComment(UUID issueId, AddCommentRequest request);

    List<IssueCommentDTO> getCommentsByIssue(UUID issueId);
}
