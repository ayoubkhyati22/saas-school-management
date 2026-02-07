package com.school.saas.module.audit.repository;

import com.school.saas.module.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findBySchoolId(UUID schoolId, Pageable pageable);

    Page<AuditLog> findByUserId(UUID userId, Pageable pageable);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId);

    Page<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.action = :action AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByActionAndTimestampBetween(
        @Param("action") String action,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:schoolId IS NULL OR a.schoolId = :schoolId) AND " +
           "(:userId IS NULL OR a.userId = :userId) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate)")
    Page<AuditLog> findByFilters(
        @Param("schoolId") UUID schoolId,
        @Param("userId") UUID userId,
        @Param("action") String action,
        @Param("entityType") String entityType,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
}
