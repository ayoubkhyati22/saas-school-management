package com.school.saas.module.exam.service;

import com.school.saas.module.exam.ExamStatus;
import com.school.saas.module.exam.ExamType;
import com.school.saas.module.exam.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ExamService {
    
    Page<ExamDTO> getAllExams(Pageable pageable);
    
    ExamDTO getExamById(UUID id);
    
    ExamDTO createExam(CreateExamRequest request);
    
    ExamDTO updateExam(UUID id, UpdateExamRequest request);
    
    void deleteExam(UUID id);
    
    List<ExamDTO> getExamsByClassroom(String classRoomId);
    
    List<ExamDTO> getExamsByCourse(String courseId);
    
    List<ExamDTO> getExamsByTeacher(String teacherId);
    
    List<ExamDTO> getExamsBySpeciality(String specialityId);
    
    Page<ExamDTO> getExamsByType(ExamType examType, Pageable pageable);
    
    Page<ExamDTO> getExamsByStatus(ExamStatus status, Pageable pageable);
    
    Page<ExamDTO> getExamsByAcademicYear(String academicYear, Pageable pageable);
    
    Page<ExamDTO> getExamsBySemester(String semester, Pageable pageable);
    
    List<ExamDTO> getExamsByDateRange(LocalDate startDate, LocalDate endDate);
    
    Page<ExamDTO> searchExams(String keyword, Pageable pageable);
    
    ExamDTO publishResults(UUID id);
    
    ExamDTO unpublishResults(UUID id);
    
    ExamDTO updateExamStatus(UUID id, ExamStatus status);
    
    ExamStatisticsDTO getExamStatistics();
}
