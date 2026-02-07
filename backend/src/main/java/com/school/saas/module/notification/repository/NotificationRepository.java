package com.school.saas.module.notification.repository;

import com.school.saas.module.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findByUserIdOrderBySentAtDesc(UUID userId, Pageable pageable);

    long countByUserIdAndReadStatusFalse(UUID userId);

    List<Notification> findBySchoolIdAndCreatedAtAfter(UUID schoolId, LocalDateTime createdAt);

    @Query("SELECT n FROM Notification n WHERE n.schoolId = :schoolId AND n.user.id = :userId ORDER BY n.sentAt DESC")
    Page<Notification> findBySchoolIdAndUserId(
        @Param("schoolId") UUID schoolId,
        @Param("userId") UUID userId,
        Pageable pageable
    );

    @Query("SELECT n FROM Notification n WHERE n.schoolId = :schoolId AND n.user.id = :userId AND n.readStatus = false ORDER BY n.sentAt DESC")
    List<Notification> findUnreadBySchoolIdAndUserId(
        @Param("schoolId") UUID schoolId,
        @Param("userId") UUID userId
    );

    @Modifying
    @Query("UPDATE Notification n SET n.readStatus = true, n.readAt = :readAt WHERE n.user.id = :userId AND n.readStatus = false")
    int markAllAsReadByUserId(@Param("userId") UUID userId, @Param("readAt") LocalDateTime readAt);
}
