package com.school.saas.module.subscription;

import com.school.saas.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SubscriptionPlan extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "monthly_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(name = "yearly_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal yearlyPrice;

    @Column(name = "max_students", nullable = false)
    private Integer maxStudents;

    @Column(name = "max_teachers", nullable = false)
    private Integer maxTeachers;

    @Column(name = "max_storage_gb", nullable = false)
    private Integer maxStorageGb;

    @Column(name = "max_classes", nullable = false)
    private Integer maxClasses;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "subscriptionPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PlanFeature> features = new ArrayList<>();
}
