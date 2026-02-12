package com.school.saas.module.exam.repository;

import com.school.saas.module.exam.ExamResult;
import com.school.saas.module.exam.ResultStatus;
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
public interface ExamResultRepository extends JpaRepository<ExamResult, UUID> {

    Page<ExamResult> findBySchoolId(UUID schoolId, Pageable pageable);

    Optional<ExamResult> findByIdAndSchoolId(UUID id, UUID schoolId);

    List<ExamResult> findBySchoolIdAndExamId(UUID schoolId, UUID examId);

    List<ExamResult> findBySchoolIdAndStudentId(UUID schoolId, UUID studentId);

    Optional<ExamResult> findBySchoolIdAndExamIdAndStudentId(UUID schoolId, UUID examId, UUID studentId);

    Page<ExamResult> findBySchoolIdAndStatus(UUID schoolId, ResultStatus status, Pageable pageable);

    @Query("SELECT AVG(er.marksObtained) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = false")
    Double getAverageMarksByExam(@Param("schoolId") UUID schoolId, @Param("examId") UUID examId);

    @Query("SELECT MAX(er.marksObtained) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = false")
    Double getHighestMarksByExam(@Param("schoolId") UUID schoolId, @Param("examId") UUID examId);

    @Query("SELECT MIN(er.marksObtained) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = false")
    Double getLowestMarksByExam(@Param("schoolId") UUID schoolId, @Param("examId") UUID examId);

    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.status = :status")
    long countByExamAndStatus(@Param("schoolId") UUID schoolId, @Param("examId") UUID examId, @Param("status") ResultStatus status);

    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = true")
    long countAbsentByExam(@Param("schoolId") UUID schoolId, @Param("examId") UUID examId);

    @Query("SELECT AVG(er.percentage) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.student.id = :studentId AND er.absent = false")
    Double getAveragePercentageByStudent(@Param("schoolId") UUID schoolId, @Param("studentId") UUID studentId);

    @Query("SELECT er FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId ORDER BY er.marksObtained DESC")
    List<ExamResult> findTopPerformersByExam(@Param("schoolId") UUID schoolId, @Param("examId") UUID examId, Pageable pageable);

    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId")
    long countBySchoolId(@Param("schoolId") UUID schoolId);

    @Query("SELECT er.status, COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId GROUP BY er.status")
    List<Object[]> countByStatusGrouped(@Param("schoolId") UUID schoolId);

    @Query("SELECT er.grade, COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.grade IS NOT NULL GROUP BY er.grade")
    List<Object[]> countByGradeGrouped(@Param("schoolId") UUID schoolId);

    boolean existsBySchoolIdAndExamIdAndStudentId(UUID schoolId, UUID examId, UUID studentId);
}