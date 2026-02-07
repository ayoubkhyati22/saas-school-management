package com.school.saas.module.teacher;

import com.school.saas.common.BaseEntity;
import com.school.saas.common.TeacherStatus;
import com.school.saas.module.user.User;
import com.school.saas.module.school.School;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "teachers", indexes = {
    @Index(name = "idx_teacher_school_id", columnList = "school_id"),
    @Index(name = "idx_teacher_employee_number", columnList = "employee_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Teacher extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "school_id", nullable = false, insertable = false, updatable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @Column(name = "speciality", length = 100)
    private String speciality;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "employee_number", nullable = false, unique = true, length = 50)
    private String employeeNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TeacherStatus status;

    @Column(name = "salary", precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "administrative_documents", columnDefinition = "jsonb")
    private String administrativeDocuments;
}
