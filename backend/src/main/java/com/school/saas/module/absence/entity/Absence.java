package com.school.saas.module.absence.entity;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.student.Student;
import com.school.saas.module.course.Course;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "absences", indexes = {
    @Index(name = "idx_absence_school_id", columnList = "school_id"),
    @Index(name = "idx_absence_student_id", columnList = "student_id"),
    @Index(name = "idx_absence_course_id", columnList = "course_id"),
    @Index(name = "idx_absence_date", columnList = "date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Absence extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false)
    private Boolean justified = false;

    @Column(name = "justification_document", length = 500)
    private String justificationDocument;

    @Column(name = "reported_by", nullable = false)
    private UUID reportedBy; // Teacher who reported the absence
}
