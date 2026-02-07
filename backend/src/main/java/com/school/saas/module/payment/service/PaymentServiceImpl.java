package com.school.saas.module.payment.service;

import com.school.saas.module.payment.dto.*;
import com.school.saas.module.payment.entity.Payment;
import com.school.saas.module.payment.entity.PaymentStatus;
import com.school.saas.module.payment.entity.PaymentType;
import com.school.saas.module.payment.mapper.PaymentMapper;
import com.school.saas.module.payment.repository.PaymentRepository;
import com.school.saas.module.student.Student;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.security.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentDTO createPayment(CreatePaymentRequest request) {
        UUID schoolId = TenantContext.getTenantId();

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        if (!student.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Student does not belong to this school");
        }

        String invoiceNumber = generateInvoiceNumber(schoolId);

        Payment payment = Payment.builder()
                .schoolId(schoolId)
                .student(student)
                .amount(request.getAmount())
                .paymentType(request.getPaymentType())
                .status(PaymentStatus.PENDING)
                .dueDate(request.getDueDate())
                .invoiceNumber(invoiceNumber)
                .notes(request.getNotes())
                .build();

        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    @Override
    @Transactional
    public PaymentDTO updatePayment(UUID id, UpdatePaymentRequest request) {
        UUID schoolId = TenantContext.getTenantId();

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));

        if (!payment.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Payment does not belong to this school");
        }

        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        if (request.getPaymentType() != null) {
            payment.setPaymentType(request.getPaymentType());
        }
        if (request.getDueDate() != null) {
            payment.setDueDate(request.getDueDate());
        }
        if (request.getNotes() != null) {
            payment.setNotes(request.getNotes());
        }

        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    @Override
    @Transactional
    public PaymentDTO markAsPaid(UUID id, MarkAsPaidRequest request) {
        UUID schoolId = TenantContext.getTenantId();

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));

        if (!payment.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Payment does not belong to this school");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidDate(request.getPaidDate());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(request.getTransactionId());
        if (request.getNotes() != null) {
            payment.setNotes(payment.getNotes() != null ?
                    payment.getNotes() + "\n" + request.getNotes() : request.getNotes());
        }

        payment = paymentRepository.save(payment);
        return paymentMapper.toDTO(payment);
    }

    @Override
    @Transactional
    public void deletePayment(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));

        if (!payment.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Payment does not belong to this school");
        }

        paymentRepository.delete(payment);
    }

    @Override
    public PaymentDTO getPaymentById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));

        if (!payment.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Payment does not belong to this school");
        }

        return paymentMapper.toDTO(payment);
    }

    @Override
    public List<PaymentDTO> getPaymentsByStudent(UUID studentId) {
        UUID schoolId = TenantContext.getTenantId();

        List<Payment> payments = paymentRepository.findBySchoolIdAndStudentId(schoolId, studentId);
        return payments.stream()
                .map(paymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getOverduePayments() {
        UUID schoolId = TenantContext.getTenantId();

        List<Payment> overduePayments = paymentRepository.findOverdue(
                schoolId, LocalDate.now(), PaymentStatus.PAID);

        return overduePayments.stream()
                .map(paymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        // This would ideally have a custom query filtering by schoolId
        return paymentRepository.findAll(pageable)
                .map(paymentMapper::toDTO);
    }

    @Override
    public PaymentStatisticsDTO getPaymentStatistics() {
        UUID schoolId = TenantContext.getTenantId();

        BigDecimal totalCollected = paymentRepository.sumBySchoolIdAndStatus(schoolId, PaymentStatus.PAID);
        BigDecimal totalPending = paymentRepository.sumBySchoolIdAndStatus(schoolId, PaymentStatus.PENDING);

        List<Payment> overduePayments = paymentRepository.findOverdue(
                schoolId, LocalDate.now(), PaymentStatus.PAID);
        BigDecimal totalOverdue = overduePayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Payment> allPayments = paymentRepository.findBySchoolIdAndStatus(schoolId, PaymentStatus.PAID);
        long paidCount = allPayments.size();
        long pendingCount = paymentRepository.findBySchoolIdAndStatus(schoolId, PaymentStatus.PENDING).size();
        long overdueCount = overduePayments.size();

        Map<String, BigDecimal> collectedByType = new HashMap<>();
        for (PaymentType type : PaymentType.values()) {
            BigDecimal amount = paymentRepository.sumBySchoolIdAndStatusAndType(
                    schoolId, PaymentStatus.PAID, type);
            if (amount.compareTo(BigDecimal.ZERO) > 0) {
                collectedByType.put(type.name(), amount);
            }
        }

        return PaymentStatisticsDTO.builder()
                .totalCollected(totalCollected)
                .totalPending(totalPending)
                .totalOverdue(totalOverdue)
                .paidCount(paidCount)
                .pendingCount(pendingCount)
                .overdueCount(overdueCount)
                .collectedByType(collectedByType)
                .build();
    }

    private String generateInvoiceNumber(UUID schoolId) {
        int year = Year.now().getValue();
        String yearPrefix = "INV-" + year + "-%";

        Integer maxSequence = paymentRepository.findMaxSequenceForYear(schoolId, yearPrefix)
                .orElse(0);

        int newSequence = maxSequence + 1;
        return String.format("INV-%d-%05d", year, newSequence);
    }
}
