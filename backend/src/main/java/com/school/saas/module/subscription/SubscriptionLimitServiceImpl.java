package com.school.saas.module.subscription;

import com.school.saas.common.Role;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.exception.SubscriptionLimitExceededException;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SubscriptionLimitServiceImpl implements SubscriptionLimitService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Override
    public void validateStudentLimit(UUID schoolId) {
        log.debug("Validating student limit for school ID: {}", schoolId);

        Subscription subscription = getActiveSubscription(schoolId);
        long currentStudents = userRepository.countBySchoolIdAndRole(schoolId, Role.STUDENT);
        int maxStudents = subscription.getSubscriptionPlan().getMaxStudents();

        if (currentStudents >= maxStudents) {
            throw new SubscriptionLimitExceededException(
                    "Student limit exceeded. Current: " + currentStudents + ", Max: " + maxStudents);
        }
    }

    @Override
    public void validateTeacherLimit(UUID schoolId) {
        log.debug("Validating teacher limit for school ID: {}", schoolId);

        Subscription subscription = getActiveSubscription(schoolId);
        long currentTeachers = userRepository.countBySchoolIdAndRole(schoolId, Role.TEACHER);
        int maxTeachers = subscription.getSubscriptionPlan().getMaxTeachers();

        if (currentTeachers >= maxTeachers) {
            throw new SubscriptionLimitExceededException(
                    "Teacher limit exceeded. Current: " + currentTeachers + ", Max: " + maxTeachers);
        }
    }

    @Override
    public void validateStorageLimit(UUID schoolId, long additionalStorageMb) {
        log.debug("Validating storage limit for school ID: {}", schoolId);

        Subscription subscription = getActiveSubscription(schoolId);
        // TODO: Implement storage tracking
        long currentStorageMb = 0; // Placeholder
        long maxStorageGb = subscription.getSubscriptionPlan().getMaxStorageGb();
        long maxStorageMb = maxStorageGb * 1024;

        if (currentStorageMb + additionalStorageMb > maxStorageMb) {
            throw new SubscriptionLimitExceededException(
                    "Storage limit exceeded. Current: " + currentStorageMb + "MB, Max: " + maxStorageMb + "MB");
        }
    }

    @Override
    public void validateClassLimit(UUID schoolId) {
        log.debug("Validating class limit for school ID: {}", schoolId);

        Subscription subscription = getActiveSubscription(schoolId);
        // TODO: Implement class counting
        long currentClasses = 0; // Placeholder
        int maxClasses = subscription.getSubscriptionPlan().getMaxClasses();

        if (currentClasses >= maxClasses) {
            throw new SubscriptionLimitExceededException(
                    "Class limit exceeded. Current: " + currentClasses + ", Max: " + maxClasses);
        }
    }

    @Override
    public boolean canAddStudent(UUID schoolId) {
        try {
            validateStudentLimit(schoolId);
            return true;
        } catch (SubscriptionLimitExceededException e) {
            return false;
        }
    }

    @Override
    public boolean canAddTeacher(UUID schoolId) {
        try {
            validateTeacherLimit(schoolId);
            return true;
        } catch (SubscriptionLimitExceededException e) {
            return false;
        }
    }

    @Override
    public boolean canAddClass(UUID schoolId) {
        try {
            validateClassLimit(schoolId);
            return true;
        } catch (SubscriptionLimitExceededException e) {
            return false;
        }
    }

    @Override
    public SubscriptionLimitsDTO getCurrentLimits(UUID schoolId) {
        log.debug("Fetching current limits for school ID: {}", schoolId);

        Subscription subscription = getActiveSubscription(schoolId);
        SubscriptionPlan plan = subscription.getSubscriptionPlan();

        long currentStudents = userRepository.countBySchoolIdAndRole(schoolId, Role.STUDENT);
        long currentTeachers = userRepository.countBySchoolIdAndRole(schoolId, Role.TEACHER);
        long currentStorageMb = 0; // TODO: Implement storage tracking
        long currentClasses = 0; // TODO: Implement class counting

        return SubscriptionLimitsDTO.builder()
                .maxStudents(plan.getMaxStudents())
                .currentStudents((int) currentStudents)
                .maxTeachers(plan.getMaxTeachers())
                .currentTeachers((int) currentTeachers)
                .maxStorageGb(plan.getMaxStorageGb())
                .currentStorageMb(currentStorageMb)
                .maxClasses(plan.getMaxClasses())
                .currentClasses((int) currentClasses)
                .build();
    }

    private Subscription getActiveSubscription(UUID schoolId) {
        return subscriptionRepository.findActiveBySchoolId(schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription found for school ID: " + schoolId));
    }
}
