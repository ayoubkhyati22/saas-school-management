package com.school.saas.module.course.repository;

import com.school.saas.module.course.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Page<Course> findBySchoolId(UUID schoolId, Pageable pageable);

    List<Course> findBySchoolId(UUID schoolId);

    Optional<Course> findByIdAndSchoolId(UUID id, UUID schoolId);

    List<Course> findByClassRoomId(UUID classRoomId);

    Page<Course> findByClassRoomId(UUID classRoomId, Pageable pageable);

    List<Course> findByTeacherId(UUID teacherId);

    Page<Course> findByTeacherId(UUID teacherId, Pageable pageable);

    long countBySchoolId(UUID schoolId);

    long countByTeacherId(UUID teacherId);

    @Query("SELECT c FROM Course c WHERE c.schoolId = :schoolId AND " +
           "(LOWER(c.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.subjectCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> searchByKeyword(@Param("schoolId") UUID schoolId,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);

    Page<Course> findBySchoolIdAndSemester(UUID schoolId, String semester, Pageable pageable);
}
