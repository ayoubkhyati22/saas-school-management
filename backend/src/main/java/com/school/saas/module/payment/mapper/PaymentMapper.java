package com.school.saas.module.payment.mapper;

import com.school.saas.module.payment.dto.PaymentDTO;
import com.school.saas.module.payment.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentDTO.builder()
                .id(payment.getId())
                .schoolId(payment.getSchoolId())
                .studentId(payment.getStudent().getId())
                .studentName(payment.getStudent().getUser().getFirstName() + " " +
                            payment.getStudent().getUser().getLastName())
                .amount(payment.getAmount())
                .paymentType(payment.getPaymentType())
                .status(payment.getStatus())
                .dueDate(payment.getDueDate())
                .paidDate(payment.getPaidDate())
                .invoiceNumber(payment.getInvoiceNumber())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
