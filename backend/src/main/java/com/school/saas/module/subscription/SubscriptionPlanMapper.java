package com.school.saas.module.subscription;

import com.school.saas.config.MapStructConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapStructConfig.class, uses = {PlanFeatureMapper.class})
public interface SubscriptionPlanMapper {

    SubscriptionPlanDTO toDTO(SubscriptionPlan subscriptionPlan);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", expression = "java(true)")
    @Mapping(target = "features", ignore = true)
    SubscriptionPlan toEntity(CreateSubscriptionPlanRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "features", ignore = true)
    void updateEntity(UpdateSubscriptionPlanRequest request, @MappingTarget SubscriptionPlan subscriptionPlan);
}
