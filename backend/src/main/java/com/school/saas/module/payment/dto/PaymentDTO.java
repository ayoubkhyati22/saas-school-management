package com.school.saas.module.payment.dto;

import com.school.saas.module.payment.entity.PaymentStatus;
import com.school.saas.module.payment.entity.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Payment details")
public class PaymentDTO {

    @Schema(description = "Payment ID")
    private UUID id;

    @Schema(description = "School ID")
    private UUID schoolId;

    @Schema(description = "Student ID")
    private UUID studentId;

    @Schema(description = "Student name")
    private String studentName;

    @Schema(description = "Payment amount")
    private BigDecimal amount;

    @Schema(description = "Payment type")
    private PaymentType paymentType;

    @Schema(description = "Payment status")
    private PaymentStatus status;

    @Schema(description = "Due date")
    private LocalDate dueDate;

    @Schema(description = "Paid date")
    private LocalDate paidDate;

    @Schema(description = "Invoice number")
    private String invoiceNumber;

    @Schema(description = "Payment method")
    private String paymentMethod;

    @Schema(description = "Transaction ID")
    private String transactionId;

    @Schema(description = "Notes")
    private String notes;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
