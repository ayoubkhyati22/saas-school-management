package com.school.saas.module.subscription;

import java.util.UUID;

public interface SubscriptionLimitService {

    void validateStudentLimit(UUID schoolId);

    void validateTeacherLimit(UUID schoolId);

    void validateStorageLimit(UUID schoolId, long additionalStorageMb);

    void validateClassLimit(UUID schoolId);

    boolean canAddStudent(UUID schoolId);

    boolean canAddTeacher(UUID schoolId);

    boolean canAddClass(UUID schoolId);

    SubscriptionLimitsDTO getCurrentLimits(UUID schoolId);
}
