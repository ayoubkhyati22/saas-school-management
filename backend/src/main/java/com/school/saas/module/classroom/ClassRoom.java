package com.school.saas.module.classroom;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.teacher.Teacher;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "classrooms", indexes = {
    @Index(name = "idx_classroom_school_id", columnList = "school_id"),
    @Index(name = "idx_classroom_class_teacher_id", columnList = "class_teacher_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ClassRoom extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "level", length = 50)
    private String level; // e.g., Grade 1, Grade 2, etc.

    @Column(name = "section", length = 50)
    private String section; // e.g., A, B, C

    @Column(name = "academic_year", length = 20)
    private String academicYear; // e.g., 2024-2025

    @Column(name = "capacity")
    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_teacher_id")
    private Teacher classTeacher;
}
