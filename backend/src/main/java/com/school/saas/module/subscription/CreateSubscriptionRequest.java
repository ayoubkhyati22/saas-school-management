package com.school.saas.module.subscription;

import com.school.saas.common.BillingCycle;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSubscriptionRequest {

    @NotNull(message = "School ID is required")
    private UUID schoolId;

    @NotNull(message = "Subscription plan ID is required")
    private UUID subscriptionPlanId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Billing cycle is required")
    private BillingCycle billingCycle;

    private Boolean autoRenew = true;
}
