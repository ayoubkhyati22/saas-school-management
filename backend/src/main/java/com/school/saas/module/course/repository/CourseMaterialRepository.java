package com.school.saas.module.course.repository;

import com.school.saas.module.course.CourseMaterial;
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
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, UUID> {

    List<CourseMaterial> findByCourseId(UUID courseId);

    Page<CourseMaterial> findByCourseId(UUID courseId, Pageable pageable);

    Optional<CourseMaterial> findByIdAndSchoolId(UUID id, UUID schoolId);

    long countByCourseId(UUID courseId);

    @Query("SELECT SUM(cm.fileSize) FROM CourseMaterial cm WHERE cm.schoolId = :schoolId")
    Long getTotalStorageUsedBySchool(@Param("schoolId") UUID schoolId);

    @Query("SELECT cm FROM CourseMaterial cm WHERE cm.course.id = :courseId AND cm.schoolId = :schoolId")
    List<CourseMaterial> findByCourseIdAndSchoolId(@Param("courseId") UUID courseId,
                                                    @Param("schoolId") UUID schoolId);
}
