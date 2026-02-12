package com.school.saas.module.exam;

import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.course.Course;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.teacher.Teacher;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exams", indexes = {
        @Index(name = "idx_exam_school", columnList = "school_id"),
        @Index(name = "idx_exam_classroom", columnList = "class_room_id"),
        @Index(name = "idx_exam_course", columnList = "course_id"),
        @Index(name = "idx_exam_teacher", columnList = "teacher_id"),
        @Index(name = "idx_exam_date", columnList = "exam_date"),
        @Index(name = "idx_exam_type", columnList = "exam_type"),
        @Index(name = "idx_exam_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 50)
    private ExamType examType;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(name = "passing_marks", nullable = false)
    private Integer passingMarks;

    @Column(length = 50)
    private String semester;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExamStatus status;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "allow_calculators")
    private Boolean allowCalculators;

    @Column(name = "allow_books")
    private Boolean allowBooks;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "results_published")
    private Boolean resultsPublished;

    @Column(name = "results_published_at")
    private LocalDateTime resultsPublishedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
