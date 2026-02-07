package com.school.saas.module.payment.dto;

import com.school.saas.module.payment.entity.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to create a payment")
public class CreatePaymentRequest {

    @NotNull(message = "Student ID is required")
    @Schema(description = "Student ID", required = true)
    private UUID studentId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Schema(description = "Payment amount", required = true)
    private BigDecimal amount;

    @NotNull(message = "Payment type is required")
    @Schema(description = "Payment type", required = true)
    private PaymentType paymentType;

    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    @Schema(description = "Due date", required = true)
    private LocalDate dueDate;

    @Schema(description = "Notes")
    private String notes;
}
