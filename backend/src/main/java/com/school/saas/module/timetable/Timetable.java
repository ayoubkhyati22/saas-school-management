package com.school.saas.module.timetable;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.course.Course;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.teacher.Teacher;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "timetables", indexes = {
    @Index(name = "idx_timetable_school_id", columnList = "school_id"),
    @Index(name = "idx_timetable_classroom_id", columnList = "class_room_id"),
    @Index(name = "idx_timetable_teacher_id", columnList = "teacher_id"),
    @Index(name = "idx_timetable_course_id", columnList = "course_id"),
    @Index(name = "idx_timetable_speciality_id", columnList = "speciality_id"),
    @Index(name = "idx_timetable_day_time", columnList = "day_of_week, start_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Timetable extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_room_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 20)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(name = "semester", length = 50)
    private String semester; // e.g., "Fall 2024", "Spring 2025"

    @Column(name = "academic_year", length = 20)
    private String academicYear; // e.g., "2024-2025"

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
