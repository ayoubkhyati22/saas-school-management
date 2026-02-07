package com.school.saas.module.subscription;

import com.school.saas.config.MapStructConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapStructConfig.class)
public interface SubscriptionMapper {

    @Mapping(target = "schoolId", source = "school.id")
    @Mapping(target = "schoolName", source = "school.name")
    @Mapping(target = "subscriptionPlanId", source = "subscriptionPlan.id")
    @Mapping(target = "planName", source = "subscriptionPlan.name")
    SubscriptionDTO toDTO(Subscription subscription);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "school", ignore = true)
    @Mapping(target = "subscriptionPlan", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    @Mapping(target = "status", ignore = true)
    Subscription toEntity(CreateSubscriptionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "school", ignore = true)
    @Mapping(target = "subscriptionPlan", ignore = true)
    @Mapping(target = "startDate", ignore = true)
    void updateEntity(UpdateSubscriptionRequest request, @MappingTarget Subscription subscription);
}
