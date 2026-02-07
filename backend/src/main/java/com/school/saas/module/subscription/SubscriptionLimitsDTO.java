package com.school.saas.module.subscription;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionLimitsDTO {
    private Integer maxStudents;
    private Integer currentStudents;
    private Integer maxTeachers;
    private Integer currentTeachers;
    private Integer maxStorageGb;
    private Long currentStorageMb;
    private Integer maxClasses;
    private Integer currentClasses;
}
