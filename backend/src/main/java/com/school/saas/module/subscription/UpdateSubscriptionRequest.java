package com.school.saas.module.subscription;

import com.school.saas.common.BillingCycle;
import com.school.saas.common.SubscriptionStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSubscriptionRequest {

    private UUID subscriptionPlanId;

    private LocalDate endDate;

    private BillingCycle billingCycle;

    private SubscriptionStatus status;

    private Boolean autoRenew;
}
