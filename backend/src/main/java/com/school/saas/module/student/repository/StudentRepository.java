package com.school.saas.module.student.repository;

import com.school.saas.common.Gender;
import com.school.saas.common.StudentStatus;
import com.school.saas.module.student.Student;
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
public interface StudentRepository extends JpaRepository<Student, UUID> {

    Page<Student> findBySchoolId(UUID schoolId, Pageable pageable);

    List<Student> findBySchoolId(UUID schoolId);

    Page<Student> findByClassRoomId(UUID classRoomId, Pageable pageable);

    List<Student> findByClassRoomId(UUID classRoomId);

    long countBySchoolId(UUID schoolId);

    // Changed: Accept StudentStatus enum instead of String
    long countBySchoolIdAndStatus(UUID schoolId, StudentStatus status);

    // Changed: Accept Gender enum instead of String
    long countBySchoolIdAndGender(UUID schoolId, Gender gender);

    long countByClassRoomId(UUID classRoomId);

    Optional<Student> findByRegistrationNumber(String registrationNumber);

    Optional<Student> findByIdAndSchoolId(UUID id, UUID schoolId);

    Optional<Student> findByUserIdAndSchoolId(UUID userId, UUID schoolId);

    @Query("SELECT s FROM Student s WHERE s.schoolId = :schoolId AND " +
            "(LOWER(s.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.registrationNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Student> searchByKeyword(@Param("schoolId") UUID schoolId,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);

    boolean existsByRegistrationNumber(String registrationNumber);
}