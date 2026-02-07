package com.school.saas.module.subscription;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface SubscriptionPlanService {

    SubscriptionPlanDTO create(CreateSubscriptionPlanRequest request);

    SubscriptionPlanDTO update(UUID id, UpdateSubscriptionPlanRequest request);

    SubscriptionPlanDTO getById(UUID id);

    Page<SubscriptionPlanDTO> getAll(Pageable pageable);

    List<SubscriptionPlanDTO> getAllActive();

    void delete(UUID id);

    void activate(UUID id);

    void deactivate(UUID id);
}
