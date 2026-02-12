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

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, String> {

    Page<ExamResult> findBySchoolId(String schoolId, Pageable pageable);

    Optional<ExamResult> findByIdAndSchoolId(String id, String schoolId);

    List<ExamResult> findBySchoolIdAndExamId(String schoolId, String examId);

    List<ExamResult> findBySchoolIdAndStudentId(String schoolId, String studentId);

    Optional<ExamResult> findBySchoolIdAndExamIdAndStudentId(String schoolId, String examId, String studentId);

    Page<ExamResult> findBySchoolIdAndStatus(String schoolId, ResultStatus status, Pageable pageable);

    @Query("SELECT AVG(er.marksObtained) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = false")
    Double getAverageMarksByExam(@Param("schoolId") String schoolId, @Param("examId") String examId);

    @Query("SELECT MAX(er.marksObtained) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = false")
    Double getHighestMarksByExam(@Param("schoolId") String schoolId, @Param("examId") String examId);

    @Query("SELECT MIN(er.marksObtained) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = false")
    Double getLowestMarksByExam(@Param("schoolId") String schoolId, @Param("examId") String examId);

    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.status = :status")
    long countByExamAndStatus(@Param("schoolId") String schoolId, @Param("examId") String examId, @Param("status") ResultStatus status);

    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId AND er.absent = true")
    long countAbsentByExam(@Param("schoolId") String schoolId, @Param("examId") String examId);

    @Query("SELECT AVG(er.percentage) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.student.id = :studentId AND er.absent = false")
    Double getAveragePercentageByStudent(@Param("schoolId") String schoolId, @Param("studentId") String studentId);

    @Query("SELECT er FROM ExamResult er WHERE er.schoolId = :schoolId AND er.exam.id = :examId ORDER BY er.marksObtained DESC")
    List<ExamResult> findTopPerformersByExam(@Param("schoolId") String schoolId, @Param("examId") String examId, Pageable pageable);

    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId")
    long countBySchoolId(@Param("schoolId") String schoolId);

    @Query("SELECT er.status, COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId GROUP BY er.status")
    List<Object[]> countByStatusGrouped(@Param("schoolId") String schoolId);

    @Query("SELECT er.grade, COUNT(er) FROM ExamResult er WHERE er.schoolId = :schoolId AND er.grade IS NOT NULL GROUP BY er.grade")
    List<Object[]> countByGradeGrouped(@Param("schoolId") String schoolId);

    boolean existsBySchoolIdAndExamIdAndStudentId(String schoolId, String examId, String studentId);
}
