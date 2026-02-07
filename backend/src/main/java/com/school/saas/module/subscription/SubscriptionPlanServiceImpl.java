package com.school.saas.module.subscription;

import com.school.saas.common.PlanFeatureType;
import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    private final PlanFeatureRepository planFeatureRepository;

    @Override
    public SubscriptionPlanDTO create(CreateSubscriptionPlanRequest request) {
        log.info("Creating new subscription plan: {}", request.getName());

        if (subscriptionPlanRepository.existsByName(request.getName())) {
            throw new BadRequestException("Subscription plan with name " + request.getName() + " already exists");
        }

        SubscriptionPlan plan = subscriptionPlanMapper.toEntity(request);
        SubscriptionPlan saved = subscriptionPlanRepository.save(plan);

        // Create features
        if (request.getFeatures() != null && !request.getFeatures().isEmpty()) {
            List<PlanFeature> features = request.getFeatures().stream()
                    .map(featureType -> PlanFeature.builder()
                            .subscriptionPlan(saved)
                            .featureType(featureType)
                            .enabled(true)
                            .build())
                    .collect(Collectors.toList());
            planFeatureRepository.saveAll(features);
            saved.setFeatures(features);
        }

        log.info("Subscription plan created successfully with ID: {}", saved.getId());
        return subscriptionPlanMapper.toDTO(saved);
    }

    @Override
    public SubscriptionPlanDTO update(UUID id, UpdateSubscriptionPlanRequest request) {
        log.info("Updating subscription plan with ID: {}", id);

        SubscriptionPlan plan = findPlanById(id);

        if (request.getName() != null &&
            !request.getName().equals(plan.getName()) &&
            subscriptionPlanRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new BadRequestException("Subscription plan with name " + request.getName() + " already exists");
        }

        subscriptionPlanMapper.updateEntity(request, plan);

        // Update features if provided
        if (request.getFeatures() != null) {
            planFeatureRepository.deleteBySubscriptionPlanId(id);

            List<PlanFeature> features = request.getFeatures().stream()
                    .map(featureType -> PlanFeature.builder()
                            .subscriptionPlan(plan)
                            .featureType(featureType)
                            .enabled(true)
                            .build())
                    .collect(Collectors.toList());
            planFeatureRepository.saveAll(features);
            plan.setFeatures(features);
        }

        SubscriptionPlan updated = subscriptionPlanRepository.save(plan);

        log.info("Subscription plan updated successfully with ID: {}", id);
        return subscriptionPlanMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionPlanDTO getById(UUID id) {
        log.info("Fetching subscription plan with ID: {}", id);
        SubscriptionPlan plan = findPlanById(id);
        return subscriptionPlanMapper.toDTO(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubscriptionPlanDTO> getAll(Pageable pageable) {
        log.info("Fetching all subscription plans with pagination");
        return subscriptionPlanRepository.findAll(pageable)
                .map(subscriptionPlanMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionPlanDTO> getAllActive() {
        log.info("Fetching all active subscription plans");
        return subscriptionPlanRepository.findByActiveTrue()
                .stream()
                .map(subscriptionPlanMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        log.info("Deleting subscription plan with ID: {}", id);
        SubscriptionPlan plan = findPlanById(id);
        subscriptionPlanRepository.delete(plan);
        log.info("Subscription plan deleted successfully with ID: {}", id);
    }

    @Override
    public void activate(UUID id) {
        log.info("Activating subscription plan with ID: {}", id);
        SubscriptionPlan plan = findPlanById(id);
        plan.setActive(true);
        subscriptionPlanRepository.save(plan);
        log.info("Subscription plan activated successfully with ID: {}", id);
    }

    @Override
    public void deactivate(UUID id) {
        log.info("Deactivating subscription plan with ID: {}", id);
        SubscriptionPlan plan = findPlanById(id);
        plan.setActive(false);
        subscriptionPlanRepository.save(plan);
        log.info("Subscription plan deactivated successfully with ID: {}", id);
    }

    private SubscriptionPlan findPlanById(UUID id) {
        return subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with ID: " + id));
    }
}
