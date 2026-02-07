package com.school.saas.module.school;

import com.school.saas.module.subscription.SubscriptionDTO;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolDetailDTO {
    private UUID id;
    private String name;
    private String address;
    private String email;
    private String phone;
    private Boolean active;
    private LocalDate registrationDate;
    private SubscriptionDTO activeSubscription;
    private Long totalStudents;
    private Long totalTeachers;
}
