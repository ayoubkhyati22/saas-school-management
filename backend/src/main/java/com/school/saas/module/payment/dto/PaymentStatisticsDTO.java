package com.school.saas.module.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Payment statistics")
public class PaymentStatisticsDTO {

    @Schema(description = "Total amount collected")
    private BigDecimal totalCollected;

    @Schema(description = "Total amount pending")
    private BigDecimal totalPending;

    @Schema(description = "Total amount overdue")
    private BigDecimal totalOverdue;

    @Schema(description = "Number of paid payments")
    private long paidCount;

    @Schema(description = "Number of pending payments")
    private long pendingCount;

    @Schema(description = "Number of overdue payments")
    private long overdueCount;

    @Schema(description = "Amount collected by payment type")
    private Map<String, BigDecimal> collectedByType;
}
