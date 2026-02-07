package com.school.saas.module.student;

import com.school.saas.common.BaseEntity;
import com.school.saas.common.Gender;
import com.school.saas.common.StudentStatus;
import com.school.saas.module.user.User;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.school.School;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_school_id", columnList = "school_id"),
    @Index(name = "idx_student_classroom_id", columnList = "class_room_id"),
    @Index(name = "idx_student_registration_number", columnList = "registration_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "school_id", nullable = false, insertable = false, updatable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_room_id")
    private ClassRoom classRoom;

    @Column(name = "registration_number", nullable = false, unique = true, length = 50)
    private String registrationNumber;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StudentStatus status;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
}
