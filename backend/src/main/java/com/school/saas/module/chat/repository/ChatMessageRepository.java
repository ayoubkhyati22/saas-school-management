package com.school.saas.module.chat.repository;

import com.school.saas.module.chat.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByCourseIdOrderByTimestampAsc(UUID courseId);

    Page<ChatMessage> findByCourseIdOrderByTimestampDesc(UUID courseId, Pageable pageable);

    List<ChatMessage> findByCourseIdAndTimestampAfterOrderByTimestampAsc(UUID courseId, LocalDateTime timestamp);

    Optional<ChatMessage> findByIdAndSchoolId(UUID id, UUID schoolId);

    long countByCourseId(UUID courseId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.course.id = :courseId AND cm.schoolId = :schoolId ORDER BY cm.timestamp ASC")
    List<ChatMessage> findByCourseIdAndSchoolId(@Param("courseId") UUID courseId,
                                                 @Param("schoolId") UUID schoolId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.course.id = :courseId AND cm.schoolId = :schoolId ORDER BY cm.timestamp DESC")
    Page<ChatMessage> findByCourseIdAndSchoolIdOrderByTimestampDesc(@Param("courseId") UUID courseId,
                                                                     @Param("schoolId") UUID schoolId,
                                                                     Pageable pageable);

    void deleteByCourseId(UUID courseId);
}
