package com.school.saas.module.subscription;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal monthlyPrice;
    private BigDecimal yearlyPrice;
    private Integer maxStudents;
    private Integer maxTeachers;
    private Integer maxStorageGb;
    private Integer maxClasses;
    private Boolean active;
    private List<PlanFeatureDTO> features;
}
