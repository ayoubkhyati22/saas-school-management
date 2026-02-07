package com.school.saas.module.subscription;

import com.school.saas.common.PlanFeatureType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSubscriptionPlanRequest {

    @NotBlank(message = "Plan name is required")
    @Size(max = 100, message = "Plan name must not exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Monthly price is required")
    @DecimalMin(value = "0.0", message = "Monthly price must be positive")
    private BigDecimal monthlyPrice;

    @NotNull(message = "Yearly price is required")
    @DecimalMin(value = "0.0", message = "Yearly price must be positive")
    private BigDecimal yearlyPrice;

    @NotNull(message = "Max students is required")
    @Min(value = 1, message = "Max students must be at least 1")
    private Integer maxStudents;

    @NotNull(message = "Max teachers is required")
    @Min(value = 1, message = "Max teachers must be at least 1")
    private Integer maxTeachers;

    @NotNull(message = "Max storage is required")
    @Min(value = 1, message = "Max storage must be at least 1 GB")
    private Integer maxStorageGb;

    @NotNull(message = "Max classes is required")
    @Min(value = 1, message = "Max classes must be at least 1")
    private Integer maxClasses;

    private List<PlanFeatureType> features;
}
