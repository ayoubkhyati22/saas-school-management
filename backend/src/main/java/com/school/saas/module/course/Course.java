package com.school.saas.module.course;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.teacher.Teacher;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "courses", indexes = {
    @Index(name = "idx_course_school_id", columnList = "school_id"),
    @Index(name = "idx_course_classroom_id", columnList = "class_room_id"),
    @Index(name = "idx_course_teacher_id", columnList = "teacher_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Course extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(name = "subject", nullable = false, length = 100)
    private String subject;

    @Column(name = "subject_code", length = 50)
    private String subjectCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "schedule", columnDefinition = "TEXT")
    private String schedule; // e.g., "Mon, Wed, Fri 10:00-11:00"

    @Column(name = "semester", length = 50)
    private String semester; // e.g., "Fall 2024", "Spring 2025"

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "documents", columnDefinition = "jsonb")
    private String documents;
}
