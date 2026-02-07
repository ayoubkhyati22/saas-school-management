package com.school.saas.module.subscription;

import com.school.saas.common.PlanFeatureType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlanFeatureRepository extends JpaRepository<PlanFeature, UUID> {

    List<PlanFeature> findBySubscriptionPlanId(UUID subscriptionPlanId);

    Optional<PlanFeature> findBySubscriptionPlanIdAndFeatureType(UUID subscriptionPlanId, PlanFeatureType featureType);

    void deleteBySubscriptionPlanId(UUID subscriptionPlanId);
}
