package com.school.saas.module.subscription;

import com.school.saas.module.school.School;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-22T18:22:27+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class SubscriptionMapperImpl implements SubscriptionMapper {

    @Override
    public SubscriptionDTO toDTO(Subscription subscription) {
        if ( subscription == null ) {
            return null;
        }

        SubscriptionDTO.SubscriptionDTOBuilder subscriptionDTO = SubscriptionDTO.builder();

        subscriptionDTO.schoolId( subscriptionSchoolId( subscription ) );
        subscriptionDTO.schoolName( subscriptionSchoolName( subscription ) );
        subscriptionDTO.subscriptionPlanId( subscriptionSubscriptionPlanId( subscription ) );
        subscriptionDTO.planName( subscriptionSubscriptionPlanName( subscription ) );
        subscriptionDTO.autoRenew( subscription.getAutoRenew() );
        subscriptionDTO.billingCycle( subscription.getBillingCycle() );
        subscriptionDTO.endDate( subscription.getEndDate() );
        subscriptionDTO.id( subscription.getId() );
        subscriptionDTO.startDate( subscription.getStartDate() );
        subscriptionDTO.status( subscription.getStatus() );

        return subscriptionDTO.build();
    }

    @Override
    public Subscription toEntity(CreateSubscriptionRequest request) {
        if ( request == null ) {
            return null;
        }

        Subscription.SubscriptionBuilder<?, ?> subscription = Subscription.builder();

        subscription.autoRenew( request.getAutoRenew() );
        subscription.billingCycle( request.getBillingCycle() );
        subscription.startDate( request.getStartDate() );

        return subscription.build();
    }

    @Override
    public void updateEntity(UpdateSubscriptionRequest request, Subscription subscription) {
        if ( request == null ) {
            return;
        }

        subscription.setAutoRenew( request.getAutoRenew() );
        subscription.setBillingCycle( request.getBillingCycle() );
        subscription.setEndDate( request.getEndDate() );
        subscription.setStatus( request.getStatus() );
    }

    private UUID subscriptionSchoolId(Subscription subscription) {
        if ( subscription == null ) {
            return null;
        }
        School school = subscription.getSchool();
        if ( school == null ) {
            return null;
        }
        UUID id = school.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String subscriptionSchoolName(Subscription subscription) {
        if ( subscription == null ) {
            return null;
        }
        School school = subscription.getSchool();
        if ( school == null ) {
            return null;
        }
        String name = school.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private UUID subscriptionSubscriptionPlanId(Subscription subscription) {
        if ( subscription == null ) {
            return null;
        }
        SubscriptionPlan subscriptionPlan = subscription.getSubscriptionPlan();
        if ( subscriptionPlan == null ) {
            return null;
        }
        UUID id = subscriptionPlan.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String subscriptionSubscriptionPlanName(Subscription subscription) {
        if ( subscription == null ) {
            return null;
        }
        SubscriptionPlan subscriptionPlan = subscription.getSubscriptionPlan();
        if ( subscriptionPlan == null ) {
            return null;
        }
        String name = subscriptionPlan.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
