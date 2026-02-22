package com.school.saas.module.subscription;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-22T18:22:26+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class SubscriptionPlanMapperImpl implements SubscriptionPlanMapper {

    @Autowired
    private PlanFeatureMapper planFeatureMapper;

    @Override
    public SubscriptionPlanDTO toDTO(SubscriptionPlan subscriptionPlan) {
        if ( subscriptionPlan == null ) {
            return null;
        }

        SubscriptionPlanDTO.SubscriptionPlanDTOBuilder subscriptionPlanDTO = SubscriptionPlanDTO.builder();

        subscriptionPlanDTO.active( subscriptionPlan.getActive() );
        subscriptionPlanDTO.description( subscriptionPlan.getDescription() );
        subscriptionPlanDTO.features( planFeatureListToPlanFeatureDTOList( subscriptionPlan.getFeatures() ) );
        subscriptionPlanDTO.id( subscriptionPlan.getId() );
        subscriptionPlanDTO.maxClasses( subscriptionPlan.getMaxClasses() );
        subscriptionPlanDTO.maxStorageGb( subscriptionPlan.getMaxStorageGb() );
        subscriptionPlanDTO.maxStudents( subscriptionPlan.getMaxStudents() );
        subscriptionPlanDTO.maxTeachers( subscriptionPlan.getMaxTeachers() );
        subscriptionPlanDTO.monthlyPrice( subscriptionPlan.getMonthlyPrice() );
        subscriptionPlanDTO.name( subscriptionPlan.getName() );
        subscriptionPlanDTO.yearlyPrice( subscriptionPlan.getYearlyPrice() );

        return subscriptionPlanDTO.build();
    }

    @Override
    public SubscriptionPlan toEntity(CreateSubscriptionPlanRequest request) {
        if ( request == null ) {
            return null;
        }

        SubscriptionPlan.SubscriptionPlanBuilder<?, ?> subscriptionPlan = SubscriptionPlan.builder();

        subscriptionPlan.description( request.getDescription() );
        subscriptionPlan.maxClasses( request.getMaxClasses() );
        subscriptionPlan.maxStorageGb( request.getMaxStorageGb() );
        subscriptionPlan.maxStudents( request.getMaxStudents() );
        subscriptionPlan.maxTeachers( request.getMaxTeachers() );
        subscriptionPlan.monthlyPrice( request.getMonthlyPrice() );
        subscriptionPlan.name( request.getName() );
        subscriptionPlan.yearlyPrice( request.getYearlyPrice() );

        subscriptionPlan.active( true );

        return subscriptionPlan.build();
    }

    @Override
    public void updateEntity(UpdateSubscriptionPlanRequest request, SubscriptionPlan subscriptionPlan) {
        if ( request == null ) {
            return;
        }

        subscriptionPlan.setDescription( request.getDescription() );
        subscriptionPlan.setMaxClasses( request.getMaxClasses() );
        subscriptionPlan.setMaxStorageGb( request.getMaxStorageGb() );
        subscriptionPlan.setMaxStudents( request.getMaxStudents() );
        subscriptionPlan.setMaxTeachers( request.getMaxTeachers() );
        subscriptionPlan.setMonthlyPrice( request.getMonthlyPrice() );
        subscriptionPlan.setName( request.getName() );
        subscriptionPlan.setYearlyPrice( request.getYearlyPrice() );
    }

    protected List<PlanFeatureDTO> planFeatureListToPlanFeatureDTOList(List<PlanFeature> list) {
        if ( list == null ) {
            return null;
        }

        List<PlanFeatureDTO> list1 = new ArrayList<PlanFeatureDTO>( list.size() );
        for ( PlanFeature planFeature : list ) {
            list1.add( planFeatureMapper.toDTO( planFeature ) );
        }

        return list1;
    }
}
