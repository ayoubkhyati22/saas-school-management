package com.school.saas.module.exam.service;

import com.school.saas.module.exam.ResultStatus;
import com.school.saas.module.exam.dto.CreateExamResultRequest;
import com.school.saas.module.exam.dto.ExamResultDTO;
import com.school.saas.module.exam.dto.ResultStatisticsDTO;
import com.school.saas.module.exam.dto.UpdateExamResultRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ExamResultService {
    
    Page<ExamResultDTO> getAllResults(Pageable pageable);
    
    ExamResultDTO getResultById(UUID id);
    
    ExamResultDTO createResult(CreateExamResultRequest request);
    
    ExamResultDTO updateResult(UUID id, UpdateExamResultRequest request);
    
    void deleteResult(UUID id);
    
    Page<ExamResultDTO> getResultsByExam(String examId, Pageable pageable);
    
    Page<ExamResultDTO> getResultsByStudent(String studentId, Pageable pageable);
    
    Page<ExamResultDTO> getResultsByStatus(ResultStatus status, Pageable pageable);
    
    Page<ExamResultDTO> searchResults(String keyword, Pageable pageable);
    
    ResultStatisticsDTO getExamStatistics(UUID examId);
    
    ResultStatisticsDTO getOverallStatistics();
}
