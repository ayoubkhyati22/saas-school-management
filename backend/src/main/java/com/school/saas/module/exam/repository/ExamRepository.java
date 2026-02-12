package com.school.saas.module.exam.repository;

import com.school.saas.module.exam.Exam;
import com.school.saas.module.exam.ExamStatus;
import com.school.saas.module.exam.ExamType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID> {

    Page<Exam> findBySchoolId(UUID schoolId, Pageable pageable);

    Optional<Exam> findByIdAndSchoolId(UUID id, UUID schoolId);

    List<Exam> findBySchoolIdAndClassRoomId(UUID schoolId, UUID classRoomId);

    List<Exam> findBySchoolIdAndCourseId(UUID schoolId, UUID courseId);

    List<Exam> findBySchoolIdAndTeacherId(UUID schoolId, UUID teacherId);

    List<Exam> findBySchoolIdAndSpecialityId(UUID schoolId, UUID specialityId);

    Page<Exam> findBySchoolIdAndExamType(UUID schoolId, ExamType examType, Pageable pageable);

    Page<Exam> findBySchoolIdAndStatus(UUID schoolId, ExamStatus status, Pageable pageable);

    Page<Exam> findBySchoolIdAndAcademicYear(UUID schoolId, String academicYear, Pageable pageable);

    Page<Exam> findBySchoolIdAndSemester(UUID schoolId, String semester, Pageable pageable);

    List<Exam> findBySchoolIdAndExamDateBetween(UUID schoolId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT e FROM Exam e WHERE e.schoolId = :schoolId AND " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Exam> searchByKeyword(@Param("schoolId") UUID schoolId,
                               @Param("keyword") String keyword,
                               Pageable pageable);

    @Query("SELECT COUNT(e) FROM Exam e WHERE e.schoolId = :schoolId")
    long countBySchoolId(@Param("schoolId") UUID schoolId);

    @Query("SELECT COUNT(e) FROM Exam e WHERE e.schoolId = :schoolId AND e.status = :status")
    long countBySchoolIdAndStatus(@Param("schoolId") UUID schoolId, @Param("status") ExamStatus status);

    @Query("SELECT COUNT(e) FROM Exam e WHERE e.schoolId = :schoolId AND e.examType = :examType")
    long countBySchoolIdAndExamType(@Param("schoolId") UUID schoolId, @Param("examType") ExamType examType);

    @Query("SELECT e.examType, COUNT(e) FROM Exam e WHERE e.schoolId = :schoolId GROUP BY e.examType")
    List<Object[]> countByExamTypeGrouped(@Param("schoolId") UUID schoolId);

    @Query("SELECT e.status, COUNT(e) FROM Exam e WHERE e.schoolId = :schoolId GROUP BY e.status")
    List<Object[]> countByStatusGrouped(@Param("schoolId") UUID schoolId);

    @Query("SELECT c.name, COUNT(e) FROM Exam e JOIN e.classRoom c WHERE e.schoolId = :schoolId GROUP BY c.name")
    List<Object[]> countByClassRoomGrouped(@Param("schoolId") UUID schoolId);

    @Query("SELECT co.subject, COUNT(e) FROM Exam e JOIN e.course co WHERE e.schoolId = :schoolId GROUP BY co.subject")
    List<Object[]> countByCourseGrouped(@Param("schoolId") UUID schoolId);

    boolean existsBySchoolIdAndClassRoomIdAndCourseIdAndExamDateAndStartTime(
            UUID schoolId, UUID classRoomId, UUID courseId, LocalDate examDate, java.time.LocalTime startTime);

    List<Exam> findBySchoolIdAndResultsPublished(UUID schoolId, Boolean resultsPublished);
}
