package com.school.saas.module.subscription;

import com.school.saas.common.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findBySchoolId(UUID schoolId);

    @Query("SELECT s FROM Subscription s WHERE s.school.id = :schoolId AND s.status = 'ACTIVE'")
    Optional<Subscription> findActiveBySchoolId(@Param("schoolId") UUID schoolId);

    List<Subscription> findByStatus(SubscriptionStatus status);

    @Query("SELECT s FROM Subscription s WHERE s.endDate <= :date AND s.status = 'ACTIVE'")
    List<Subscription> findExpiringSoon(@Param("date") LocalDate date);

    @Query("SELECT s FROM Subscription s WHERE s.endDate < :date AND s.status = 'ACTIVE'")
    List<Subscription> findExpired(@Param("date") LocalDate date);
}
