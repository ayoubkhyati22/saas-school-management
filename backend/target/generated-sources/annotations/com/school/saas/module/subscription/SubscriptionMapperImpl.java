package com.school.saas.module.subscription;

import com.school.saas.module.school.School;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-12T11:17:33+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 19.0.1 (Oracle Corporation)"
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
        subscriptionDTO.id( subscription.getId() );
        subscriptionDTO.startDate( subscription.getStartDate() );
        subscriptionDTO.endDate( subscription.getEndDate() );
        subscriptionDTO.billingCycle( subscription.getBillingCycle() );
        subscriptionDTO.status( subscription.getStatus() );
        subscriptionDTO.autoRenew( subscription.getAutoRenew() );

        return subscriptionDTO.build();
    }

    @Override
    public Subscription toEntity(CreateSubscriptionRequest request) {
        if ( request == null ) {
            return null;
        }

        Subscription.SubscriptionBuilder<?, ?> subscription = Subscription.builder();

        subscription.startDate( request.getStartDate() );
        subscription.billingCycle( request.getBillingCycle() );
        subscription.autoRenew( request.getAutoRenew() );

        return subscription.build();
    }

    @Override
    public void updateEntity(UpdateSubscriptionRequest request, Subscription subscription) {
        if ( request == null ) {
            return;
        }

        subscription.setEndDate( request.getEndDate() );
        subscription.setBillingCycle( request.getBillingCycle() );
        subscription.setStatus( request.getStatus() );
        subscription.setAutoRenew( request.getAutoRenew() );
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
