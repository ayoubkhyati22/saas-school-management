package com.school.saas.module.subscription;

import com.school.saas.config.MapStructConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapStructConfig.class)
public interface PlanFeatureMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "featureType", source = "featureType")
    @Mapping(target = "enabled", source = "enabled")
    PlanFeatureDTO toDTO(PlanFeature planFeature);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "subscriptionPlan", ignore = true)
    PlanFeature toEntity(PlanFeatureDTO planFeatureDTO);
}
