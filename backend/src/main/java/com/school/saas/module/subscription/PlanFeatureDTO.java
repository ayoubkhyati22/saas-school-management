package com.school.saas.module.subscription;

import com.school.saas.common.PlanFeatureType;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanFeatureDTO {
    private UUID id;
    private PlanFeatureType featureType;
    private Boolean enabled;
}
