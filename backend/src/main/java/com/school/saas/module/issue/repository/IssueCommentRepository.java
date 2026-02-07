package com.school.saas.module.issue.repository;

import com.school.saas.module.issue.entity.IssueComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueCommentRepository extends JpaRepository<IssueComment, UUID> {

    List<IssueComment> findByIssueIdOrderByCreatedAtAsc(UUID issueId);

    long countByIssueId(UUID issueId);
}
