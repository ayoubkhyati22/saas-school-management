package com.school.saas.module.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to mark payment as paid")
public class MarkAsPaidRequest {

    @NotNull(message = "Paid date is required")
    @Schema(description = "Date when payment was received", required = true)
    private LocalDate paidDate;

    @NotBlank(message = "Payment method is required")
    @Schema(description = "Payment method (CASH, CARD, BANK_TRANSFER, ONLINE)", required = true)
    private String paymentMethod;

    @Schema(description = "Transaction ID")
    private String transactionId;

    @Schema(description = "Additional notes")
    private String notes;
}
