package com.school.saas.module.subscription;

import com.school.saas.common.BaseEntity;
import com.school.saas.common.PlanFeatureType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "plan_features")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PlanFeature extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_plan_id", nullable = false)
    private SubscriptionPlan subscriptionPlan;

    @Enumerated(EnumType.STRING)
    @Column(name = "feature_type", nullable = false, length = 50)
    private PlanFeatureType featureType;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;
}
