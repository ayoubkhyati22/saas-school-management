package com.school.saas.module.payment.entity;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.student.Student;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_school_id", columnList = "school_id"),
    @Index(name = "idx_payment_student_id", columnList = "student_id"),
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_due_date", columnList = "due_date"),
    @Index(name = "idx_payment_invoice_number", columnList = "invoice_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Payment extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 30)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // CASH, CARD, BANK_TRANSFER, ONLINE, etc.

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
