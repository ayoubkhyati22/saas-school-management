package com.school.saas.module.teacher.repository;

import com.school.saas.module.teacher.Teacher;
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
public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    Page<Teacher> findBySchoolId(UUID schoolId, Pageable pageable);

    List<Teacher> findBySchoolId(UUID schoolId);

    long countBySchoolId(UUID schoolId);

    long countBySchoolIdAndStatus(UUID schoolId, String status);

    Optional<Teacher> findByEmployeeNumber(String employeeNumber);

    Optional<Teacher> findByIdAndSchoolId(UUID id, UUID schoolId);

    Optional<Teacher> findByUserIdAndSchoolId(UUID userId, UUID schoolId);

    @Query("SELECT t FROM Teacher t WHERE t.schoolId = :schoolId AND " +
           "(LOWER(t.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.employeeNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.speciality) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Teacher> searchByKeyword(@Param("schoolId") UUID schoolId,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);

    boolean existsByEmployeeNumber(String employeeNumber);

    Page<Teacher> findBySchoolIdAndStatus(UUID schoolId, String status, Pageable pageable);
}
