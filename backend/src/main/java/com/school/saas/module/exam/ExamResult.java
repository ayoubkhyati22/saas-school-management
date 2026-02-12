package com.school.saas.module.exam;

import com.school.saas.module.student.Student;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exam_results", indexes = {
        @Index(name = "idx_result_exam", columnList = "exam_id"),
        @Index(name = "idx_result_student", columnList = "student_id"),
        @Index(name = "idx_result_school", columnList = "school_id"),
        @Index(name = "idx_result_grade", columnList = "grade")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_exam_student", columnNames = {"exam_id", "student_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(nullable = false)
    private Double percentage;

    @Column(length = 5)
    private String grade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResultStatus status;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "absent")
    private Boolean absent;

    @Column(name = "rank")
    private Integer rank;

    @Column(name = "graded_by")
    private String gradedBy;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
