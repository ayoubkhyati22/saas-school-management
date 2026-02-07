package com.school.saas.module.issue.mapper;

import com.school.saas.module.issue.dto.IssueDTO;
import com.school.saas.module.issue.entity.Issue;
import org.springframework.stereotype.Component;

@Component
public class IssueMapper {

    public IssueDTO toDTO(Issue issue) {
        if (issue == null) {
            return null;
        }

        return IssueDTO.builder()
                .id(issue.getId())
                .schoolId(issue.getSchoolId())
                .reportedBy(issue.getReportedBy())
                .assignedTo(issue.getAssignedTo())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .issueType(issue.getIssueType())
                .priority(issue.getPriority())
                .status(issue.getStatus())
                .resolution(issue.getResolution())
                .resolvedAt(issue.getResolvedAt())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .build();
    }
}
