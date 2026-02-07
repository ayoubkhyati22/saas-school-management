package com.school.saas.module.subscription;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface SubscriptionService {

    SubscriptionDTO create(CreateSubscriptionRequest request);

    SubscriptionDTO update(UUID id, UpdateSubscriptionRequest request);

    SubscriptionDTO getById(UUID id);

    SubscriptionDTO getActiveBySchoolId(UUID schoolId);

    List<SubscriptionDTO> getBySchoolId(UUID schoolId);

    Page<SubscriptionDTO> getAll(Pageable pageable);

    void cancel(UUID id);

    void renew(UUID id);

    void checkAndUpdateExpiredSubscriptions();
}
