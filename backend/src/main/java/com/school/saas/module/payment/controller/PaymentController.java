package com.school.saas.module.payment.controller;

import com.school.saas.module.payment.dto.*;
import com.school.saas.module.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment management endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new payment", description = "School admins can create payment records")
    public ResponseEntity<PaymentDTO> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentDTO payment = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update a payment")
    public ResponseEntity<PaymentDTO> updatePayment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePaymentRequest request) {
        PaymentDTO payment = paymentService.updatePayment(id, request);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/{id}/mark-paid")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Mark payment as paid")
    public ResponseEntity<PaymentDTO> markAsPaid(
            @PathVariable UUID id,
            @Valid @RequestBody MarkAsPaidRequest request) {
        PaymentDTO payment = paymentService.markAsPaid(id, request);
        return ResponseEntity.ok(payment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete a payment")
    public ResponseEntity<Void> deletePayment(@PathVariable UUID id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable UUID id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get all payments for a student")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStudent(@PathVariable UUID studentId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStudent(studentId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get all overdue payments")
    public ResponseEntity<List<PaymentDTO>> getOverduePayments() {
        List<PaymentDTO> payments = paymentService.getOverduePayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get all payments (paginated)")
    public ResponseEntity<Page<PaymentDTO>> getAllPayments(Pageable pageable) {
        Page<PaymentDTO> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get payment statistics")
    public ResponseEntity<PaymentStatisticsDTO> getPaymentStatistics() {
        PaymentStatisticsDTO statistics = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(statistics);
    }
}
