package com.school.saas.module.issue.mapper;

import com.school.saas.module.issue.dto.IssueCommentDTO;
import com.school.saas.module.issue.entity.IssueComment;
import org.springframework.stereotype.Component;

@Component
public class IssueCommentMapper {

    public IssueCommentDTO toDTO(IssueComment comment) {
        if (comment == null) {
            return null;
        }

        return IssueCommentDTO.builder()
                .id(comment.getId())
                .issueId(comment.getIssue().getId())
                .userId(comment.getUserId())
                .comment(comment.getComment())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
