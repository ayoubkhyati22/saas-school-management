package com.school.saas.module.chat;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.course.Course;
import com.school.saas.module.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_chat_message_school_id", columnList = "school_id"),
    @Index(name = "idx_chat_message_course_id", columnList = "course_id"),
    @Index(name = "idx_chat_message_sender_id", columnList = "sender_id"),
    @Index(name = "idx_chat_message_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ChatMessage extends BaseEntity {

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "message_type", nullable = false, length = 50)
    private String messageType; // TEXT, FILE, IMAGE

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
}
