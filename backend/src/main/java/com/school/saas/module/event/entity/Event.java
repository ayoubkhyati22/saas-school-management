package com.school.saas.module.event.entity;

import com.school.saas.common.BaseEntity;
import com.school.saas.common.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_event_school_id", columnList = "school_id"),
    @Index(name = "idx_event_date", columnList = "event_date"),
    @Index(name = "idx_event_target_role", columnList = "target_role")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Event extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 30)
    private EventType eventType;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(length = 200)
    private String location;

    @Column(name = "target_role", length = 20)
    private String targetRole; // "ALL", or specific Role name (STUDENT, TEACHER, PARENT)

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;
}
