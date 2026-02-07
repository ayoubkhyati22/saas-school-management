package com.school.saas.module.absence.repository;

import com.school.saas.module.absence.entity.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, UUID> {

    List<Absence> findByStudentId(UUID studentId);

    List<Absence> findByStudentIdAndCourseId(UUID studentId, UUID courseId);

    long countByStudentId(UUID studentId);

    List<Absence> findBySchoolIdAndDateBetween(UUID schoolId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT a FROM Absence a WHERE a.schoolId = :schoolId AND a.student.id = :studentId")
    List<Absence> findBySchoolIdAndStudentId(@Param("schoolId") UUID schoolId, @Param("studentId") UUID studentId);

    @Query("SELECT a FROM Absence a WHERE a.schoolId = :schoolId AND a.student.id = :studentId AND a.date BETWEEN :startDate AND :endDate")
    List<Absence> findBySchoolIdAndStudentIdAndDateBetween(
        @Param("schoolId") UUID schoolId,
        @Param("studentId") UUID studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(a) FROM Absence a WHERE a.schoolId = :schoolId AND a.student.id = :studentId AND a.justified = :justified")
    long countBySchoolIdAndStudentIdAndJustified(
        @Param("schoolId") UUID schoolId,
        @Param("studentId") UUID studentId,
        @Param("justified") boolean justified
    );
}
