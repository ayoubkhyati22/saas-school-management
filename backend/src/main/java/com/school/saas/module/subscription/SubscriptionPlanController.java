package com.school.saas.module.subscription;

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
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
@Tag(name = "Subscription Plan Management", description = "APIs for managing subscription plans")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @PostMapping
    @Operation(summary = "Create a new subscription plan", description = "Creates a new subscription plan")
    public ResponseEntity<SubscriptionPlanDTO> createPlan(@Valid @RequestBody CreateSubscriptionPlanRequest request) {
        SubscriptionPlanDTO created = subscriptionPlanService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a subscription plan", description = "Updates an existing subscription plan by ID")
    public ResponseEntity<SubscriptionPlanDTO> updatePlan(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSubscriptionPlanRequest request) {
        SubscriptionPlanDTO updated = subscriptionPlanService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subscription plan by ID", description = "Retrieves a subscription plan by its ID")
    public ResponseEntity<SubscriptionPlanDTO> getPlanById(@PathVariable UUID id) {
        SubscriptionPlanDTO plan = subscriptionPlanService.getById(id);
        return ResponseEntity.ok(plan);
    }

    @GetMapping
    @Operation(summary = "Get all subscription plans", description = "Retrieves all subscription plans with pagination")
    public ResponseEntity<Page<SubscriptionPlanDTO>> getAllPlans(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<SubscriptionPlanDTO> plans = subscriptionPlanService.getAll(pageable);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active subscription plans", description = "Retrieves all active subscription plans")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllActivePlans() {
        List<SubscriptionPlanDTO> plans = subscriptionPlanService.getAllActive();
        return ResponseEntity.ok(plans);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a subscription plan", description = "Deletes a subscription plan by ID")
    public ResponseEntity<Void> deletePlan(@PathVariable UUID id) {
        subscriptionPlanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a subscription plan", description = "Activates a deactivated plan")
    public ResponseEntity<Void> activatePlan(@PathVariable UUID id) {
        subscriptionPlanService.activate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a subscription plan", description = "Deactivates an active plan")
    public ResponseEntity<Void> deactivatePlan(@PathVariable UUID id) {
        subscriptionPlanService.deactivate(id);
        return ResponseEntity.ok().build();
    }
}
