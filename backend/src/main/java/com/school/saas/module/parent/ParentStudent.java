package com.school.saas.module.parent;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.student.Student;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "parent_students", indexes = {
    @Index(name = "idx_parent_student_parent_id", columnList = "parent_id"),
    @Index(name = "idx_parent_student_student_id", columnList = "student_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_parent_student", columnNames = {"parent_id", "student_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ParentStudent extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "is_primary_contact", nullable = false)
    private Boolean isPrimaryContact;

    @Column(name = "relationship_type", nullable = false, length = 50)
    private String relationshipType; // FATHER, MOTHER, GUARDIAN, OTHER
}
