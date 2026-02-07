package com.school.saas.module.payment.repository;

import com.school.saas.module.payment.entity.Payment;
import com.school.saas.module.payment.entity.PaymentStatus;
import com.school.saas.module.payment.entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findByStudentId(UUID studentId);

    List<Payment> findBySchoolIdAndStatus(UUID schoolId, PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.schoolId = :schoolId AND p.dueDate < :now AND p.status != :paidStatus")
    List<Payment> findOverdue(
        @Param("schoolId") UUID schoolId,
        @Param("now") LocalDate now,
        @Param("paidStatus") PaymentStatus paidStatus
    );

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.schoolId = :schoolId AND p.status = :status")
    BigDecimal sumBySchoolIdAndStatus(@Param("schoolId") UUID schoolId, @Param("status") PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.schoolId = :schoolId AND p.student.id = :studentId")
    List<Payment> findBySchoolIdAndStudentId(@Param("schoolId") UUID schoolId, @Param("studentId") UUID studentId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.schoolId = :schoolId AND p.status = :status AND p.paymentType = :type")
    BigDecimal sumBySchoolIdAndStatusAndType(
        @Param("schoolId") UUID schoolId,
        @Param("status") PaymentStatus status,
        @Param("type") PaymentType type
    );

    @Query("SELECT MAX(CAST(SUBSTRING(p.invoiceNumber, 10) AS int)) FROM Payment p WHERE p.schoolId = :schoolId AND p.invoiceNumber LIKE :yearPrefix")
    Optional<Integer> findMaxSequenceForYear(@Param("schoolId") UUID schoolId, @Param("yearPrefix") String yearPrefix);
}
