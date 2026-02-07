package com.school.saas.module.subscription;

import com.school.saas.common.BillingCycle;
import com.school.saas.common.SubscriptionStatus;
import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.module.school.School;
import com.school.saas.module.school.SchoolRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final SchoolRepository schoolRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public SubscriptionDTO create(CreateSubscriptionRequest request) {
        log.info("Creating new subscription for school ID: {}", request.getSchoolId());

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + request.getSchoolId()));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with ID: " + request.getSubscriptionPlanId()));

        // Check if school already has an active subscription
        subscriptionRepository.findActiveBySchoolId(request.getSchoolId())
                .ifPresent(existing -> {
                    throw new BadRequestException("School already has an active subscription");
                });

        Subscription subscription = subscriptionMapper.toEntity(request);
        subscription.setSchool(school);
        subscription.setSubscriptionPlan(plan);
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        // Calculate end date based on billing cycle
        LocalDate endDate = calculateEndDate(request.getStartDate(), request.getBillingCycle());
        subscription.setEndDate(endDate);

        Subscription saved = subscriptionRepository.save(subscription);

        log.info("Subscription created successfully with ID: {}", saved.getId());
        return subscriptionMapper.toDTO(saved);
    }

    @Override
    public SubscriptionDTO update(UUID id, UpdateSubscriptionRequest request) {
        log.info("Updating subscription with ID: {}", id);

        Subscription subscription = findSubscriptionById(id);

        if (request.getSubscriptionPlanId() != null) {
            SubscriptionPlan newPlan = subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with ID: " + request.getSubscriptionPlanId()));
            subscription.setSubscriptionPlan(newPlan);
        }

        subscriptionMapper.updateEntity(request, subscription);
        Subscription updated = subscriptionRepository.save(subscription);

        log.info("Subscription updated successfully with ID: {}", id);
        return subscriptionMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionDTO getById(UUID id) {
        log.info("Fetching subscription with ID: {}", id);
        Subscription subscription = findSubscriptionById(id);
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionDTO getActiveBySchoolId(UUID schoolId) {
        log.info("Fetching active subscription for school ID: {}", schoolId);
        Subscription subscription = subscriptionRepository.findActiveBySchoolId(schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription found for school ID: " + schoolId));
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionDTO> getBySchoolId(UUID schoolId) {
        log.info("Fetching all subscriptions for school ID: {}", schoolId);
        return subscriptionRepository.findBySchoolId(schoolId)
                .stream()
                .map(subscriptionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubscriptionDTO> getAll(Pageable pageable) {
        log.info("Fetching all subscriptions with pagination");
        return subscriptionRepository.findAll(pageable)
                .map(subscriptionMapper::toDTO);
    }

    @Override
    public void cancel(UUID id) {
        log.info("Cancelling subscription with ID: {}", id);
        Subscription subscription = findSubscriptionById(id);
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);
        log.info("Subscription cancelled successfully with ID: {}", id);
    }

    @Override
    public void renew(UUID id) {
        log.info("Renewing subscription with ID: {}", id);
        Subscription subscription = findSubscriptionById(id);

        if (subscription.getStatus() != SubscriptionStatus.EXPIRED &&
            subscription.getStatus() != SubscriptionStatus.CANCELLED) {
            throw new BadRequestException("Can only renew expired or cancelled subscriptions");
        }

        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartDate(LocalDate.now());
        LocalDate endDate = calculateEndDate(subscription.getStartDate(), subscription.getBillingCycle());
        subscription.setEndDate(endDate);

        subscriptionRepository.save(subscription);
        log.info("Subscription renewed successfully with ID: {}", id);
    }

    @Override
    public void checkAndUpdateExpiredSubscriptions() {
        log.info("Checking for expired subscriptions");
        List<Subscription> expired = subscriptionRepository.findExpired(LocalDate.now());

        for (Subscription subscription : expired) {
            if (subscription.getAutoRenew()) {
                // Auto-renew logic
                subscription.setStartDate(subscription.getEndDate().plusDays(1));
                LocalDate newEndDate = calculateEndDate(subscription.getStartDate(), subscription.getBillingCycle());
                subscription.setEndDate(newEndDate);
                log.info("Auto-renewed subscription ID: {}", subscription.getId());
            } else {
                subscription.setStatus(SubscriptionStatus.EXPIRED);
                log.info("Marked subscription as expired ID: {}", subscription.getId());
            }
        }

        subscriptionRepository.saveAll(expired);
    }

    private Subscription findSubscriptionById(UUID id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));
    }

    private LocalDate calculateEndDate(LocalDate startDate, BillingCycle billingCycle) {
        return billingCycle == BillingCycle.MONTHLY
                ? startDate.plusMonths(1)
                : startDate.plusYears(1);
    }
}
