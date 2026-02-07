package com.school.saas.module.classroom.repository;

import com.school.saas.module.classroom.ClassRoom;
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
public interface ClassRoomRepository extends JpaRepository<ClassRoom, UUID> {

    Page<ClassRoom> findBySchoolId(UUID schoolId, Pageable pageable);

    List<ClassRoom> findBySchoolId(UUID schoolId);

    Optional<ClassRoom> findByIdAndSchoolId(UUID id, UUID schoolId);

    long countBySchoolId(UUID schoolId);

    List<ClassRoom> findBySchoolIdAndAcademicYear(UUID schoolId, String academicYear);

    Page<ClassRoom> findBySchoolIdAndAcademicYear(UUID schoolId, String academicYear, Pageable pageable);

    Optional<ClassRoom> findBySchoolIdAndNameAndAcademicYear(UUID schoolId, String name, String academicYear);

    @Query("SELECT c FROM ClassRoom c WHERE c.schoolId = :schoolId AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.level) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.section) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<ClassRoom> searchByKeyword(@Param("schoolId") UUID schoolId,
                                    @Param("keyword") String keyword,
                                    Pageable pageable);
}
