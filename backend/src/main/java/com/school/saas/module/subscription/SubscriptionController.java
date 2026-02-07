package com.school.saas.module.subscription;

import com.school.saas.security.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscription Management", description = "APIs for managing subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionLimitService subscriptionLimitService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create a new subscription", description = "Creates a new subscription for a school")
    public ResponseEntity<SubscriptionDTO> createSubscription(@Valid @RequestBody CreateSubscriptionRequest request) {
        SubscriptionDTO created = subscriptionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update a subscription", description = "Updates an existing subscription by ID")
    public ResponseEntity<SubscriptionDTO> updateSubscription(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSubscriptionRequest request) {
        SubscriptionDTO updated = subscriptionService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get subscription by ID", description = "Retrieves a subscription by its ID")
    public ResponseEntity<SubscriptionDTO> getSubscriptionById(@PathVariable UUID id) {
        SubscriptionDTO subscription = subscriptionService.getById(id);
        return ResponseEntity.ok(subscription);
    }

    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get subscriptions by school", description = "Retrieves all subscriptions for a school")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptionsBySchool(@PathVariable UUID schoolId) {
        List<SubscriptionDTO> subscriptions = subscriptionService.getBySchoolId(schoolId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/school/{schoolId}/active")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get active subscription", description = "Retrieves the active subscription for a school")
    public ResponseEntity<SubscriptionDTO> getActiveSubscription(@PathVariable UUID schoolId) {
        SubscriptionDTO subscription = subscriptionService.getActiveBySchoolId(schoolId);
        return ResponseEntity.ok(subscription);
    }

    @GetMapping("/current")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get current school subscription", description = "Retrieves the active subscription for current tenant")
    public ResponseEntity<SubscriptionDTO> getCurrentSubscription() {
        UUID schoolId = TenantContext.getTenantId();
        SubscriptionDTO subscription = subscriptionService.getActiveBySchoolId(schoolId);
        return ResponseEntity.ok(subscription);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all subscriptions", description = "Retrieves all subscriptions with pagination")
    public ResponseEntity<Page<SubscriptionDTO>> getAllSubscriptions(
            @PageableDefault(size = 20, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<SubscriptionDTO> subscriptions = subscriptionService.getAll(pageable);
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Cancel a subscription", description = "Cancels an active subscription")
    public ResponseEntity<Void> cancelSubscription(@PathVariable UUID id) {
        subscriptionService.cancel(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    @Operation(summary = "Renew a subscription", description = "Renews an expired or cancelled subscription")
    public ResponseEntity<Void> renewSubscription(@PathVariable UUID id) {
        subscriptionService.renew(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/limits")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get subscription limits", description = "Retrieves current subscription limits for tenant")
    public ResponseEntity<SubscriptionLimitsDTO> getSubscriptionLimits() {
        UUID schoolId = TenantContext.getTenantId();
        SubscriptionLimitsDTO limits = subscriptionLimitService.getCurrentLimits(schoolId);
        return ResponseEntity.ok(limits);
    }
}
