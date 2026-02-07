package com.school.saas.module.event.repository;

import com.school.saas.module.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findBySchoolIdAndEventDateAfter(UUID schoolId, LocalDateTime eventDate);

    List<Event> findBySchoolIdAndTargetRole(UUID schoolId, String targetRole);

    @Query("SELECT e FROM Event e WHERE e.schoolId = :schoolId AND (e.targetRole = :targetRole OR e.targetRole = 'ALL') AND e.eventDate >= :now ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEventsBySchoolIdAndTargetRole(
        @Param("schoolId") UUID schoolId,
        @Param("targetRole") String targetRole,
        @Param("now") LocalDateTime now
    );

    @Query("SELECT e FROM Event e WHERE e.schoolId = :schoolId AND e.eventDate BETWEEN :startDate AND :endDate ORDER BY e.eventDate ASC")
    List<Event> findBySchoolIdAndEventDateBetween(
        @Param("schoolId") UUID schoolId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    List<Event> findBySchoolIdOrderByEventDateDesc(UUID schoolId);
}
