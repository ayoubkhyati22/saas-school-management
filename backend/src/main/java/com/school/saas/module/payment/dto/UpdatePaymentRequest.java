package com.school.saas.module.payment.dto;

import com.school.saas.module.payment.entity.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to update a payment")
public class UpdatePaymentRequest {

    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Schema(description = "Payment amount")
    private BigDecimal amount;

    @Schema(description = "Payment type")
    private PaymentType paymentType;

    @Schema(description = "Due date")
    private LocalDate dueDate;

    @Schema(description = "Notes")
    private String notes;
}
