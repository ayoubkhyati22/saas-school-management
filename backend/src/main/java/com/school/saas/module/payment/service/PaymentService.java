package com.school.saas.module.payment.service;

import com.school.saas.module.payment.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentDTO createPayment(CreatePaymentRequest request);

    PaymentDTO updatePayment(UUID id, UpdatePaymentRequest request);

    PaymentDTO markAsPaid(UUID id, MarkAsPaidRequest request);

    void deletePayment(UUID id);

    PaymentDTO getPaymentById(UUID id);

    List<PaymentDTO> getPaymentsByStudent(UUID studentId);

    List<PaymentDTO> getOverduePayments();

    Page<PaymentDTO> getAllPayments(Pageable pageable);

    PaymentStatisticsDTO getPaymentStatistics();
}
