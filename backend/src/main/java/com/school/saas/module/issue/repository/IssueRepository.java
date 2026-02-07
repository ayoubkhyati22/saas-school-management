package com.school.saas.module.issue.repository;

import com.school.saas.module.issue.entity.Issue;
import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {

    List<Issue> findBySchoolId(UUID schoolId);

    List<Issue> findByAssignedTo(UUID assignedTo);

    List<Issue> findByStatus(IssueStatus status);

    List<Issue> findByPriority(IssuePriority priority);

    List<Issue> findBySchoolIdAndStatus(UUID schoolId, IssueStatus status);

    List<Issue> findBySchoolIdAndPriority(UUID schoolId, IssuePriority priority);

    List<Issue> findByAssignedToAndStatus(UUID assignedTo, IssueStatus status);
}
