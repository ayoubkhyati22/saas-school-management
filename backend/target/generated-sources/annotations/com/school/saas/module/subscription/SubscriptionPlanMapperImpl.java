package com.school.saas.module.subscription;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-12T11:17:33+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 19.0.1 (Oracle Corporation)"
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

        subscriptionPlanDTO.id( subscriptionPlan.getId() );
        subscriptionPlanDTO.name( subscriptionPlan.getName() );
        subscriptionPlanDTO.description( subscriptionPlan.getDescription() );
        subscriptionPlanDTO.monthlyPrice( subscriptionPlan.getMonthlyPrice() );
        subscriptionPlanDTO.yearlyPrice( subscriptionPlan.getYearlyPrice() );
        subscriptionPlanDTO.maxStudents( subscriptionPlan.getMaxStudents() );
        subscriptionPlanDTO.maxTeachers( subscriptionPlan.getMaxTeachers() );
        subscriptionPlanDTO.maxStorageGb( subscriptionPlan.getMaxStorageGb() );
        subscriptionPlanDTO.maxClasses( subscriptionPlan.getMaxClasses() );
        subscriptionPlanDTO.active( subscriptionPlan.getActive() );
        subscriptionPlanDTO.features( planFeatureListToPlanFeatureDTOList( subscriptionPlan.getFeatures() ) );

        return subscriptionPlanDTO.build();
    }

    @Override
    public SubscriptionPlan toEntity(CreateSubscriptionPlanRequest request) {
        if ( request == null ) {
            return null;
        }

        SubscriptionPlan.SubscriptionPlanBuilder<?, ?> subscriptionPlan = SubscriptionPlan.builder();

        subscriptionPlan.name( request.getName() );
        subscriptionPlan.description( request.getDescription() );
        subscriptionPlan.monthlyPrice( request.getMonthlyPrice() );
        subscriptionPlan.yearlyPrice( request.getYearlyPrice() );
        subscriptionPlan.maxStudents( request.getMaxStudents() );
        subscriptionPlan.maxTeachers( request.getMaxTeachers() );
        subscriptionPlan.maxStorageGb( request.getMaxStorageGb() );
        subscriptionPlan.maxClasses( request.getMaxClasses() );

        subscriptionPlan.active( true );

        return subscriptionPlan.build();
    }

    @Override
    public void updateEntity(UpdateSubscriptionPlanRequest request, SubscriptionPlan subscriptionPlan) {
        if ( request == null ) {
            return;
        }

        subscriptionPlan.setName( request.getName() );
        subscriptionPlan.setDescription( request.getDescription() );
        subscriptionPlan.setMonthlyPrice( request.getMonthlyPrice() );
        subscriptionPlan.setYearlyPrice( request.getYearlyPrice() );
        subscriptionPlan.setMaxStudents( request.getMaxStudents() );
        subscriptionPlan.setMaxTeachers( request.getMaxTeachers() );
        subscriptionPlan.setMaxStorageGb( request.getMaxStorageGb() );
        subscriptionPlan.setMaxClasses( request.getMaxClasses() );
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
