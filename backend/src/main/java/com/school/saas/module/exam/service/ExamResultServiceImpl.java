package com.school.saas.module.exam.service;

import com.school.saas.module.exam.Exam;
import com.school.saas.module.exam.ExamResult;
import com.school.saas.module.exam.ResultStatus;
import com.school.saas.module.exam.dto.CreateExamResultRequest;
import com.school.saas.module.exam.dto.ExamResultDTO;
import com.school.saas.module.exam.dto.ResultStatisticsDTO;
import com.school.saas.module.exam.dto.UpdateExamResultRequest;
import com.school.saas.module.exam.mapper.ExamMapper;
import com.school.saas.module.exam.repository.ExamRepository;
import com.school.saas.module.exam.repository.ExamResultRepository;
import com.school.saas.module.student.Student;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.security.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamResultServiceImpl implements ExamResultService {

    private final ExamResultRepository examResultRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;
    private final ExamMapper examMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ExamResultDTO> getAllResults(Pageable pageable) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        return examResultRepository.findBySchoolId(schoolId, pageable)
                .map(examMapper::toResultDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResultDTO getResultById(UUID id) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        ExamResult result = examResultRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new RuntimeException("Exam result not found"));
        return examMapper.toResultDTO(result);  // ✅ CORRECT

    }

    @Override
    @Transactional
    public ExamResultDTO createResult(CreateExamResultRequest request) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));

        Exam exam = examRepository.findByIdAndSchoolId(UUID.fromString(request.getExamId()), schoolId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Student student = studentRepository.findByIdAndSchoolId(UUID.fromString(request.getStudentId()), schoolId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (examResultRepository.existsBySchoolIdAndExamIdAndStudentId(schoolId, exam.getId(), student.getId())) {
            throw new RuntimeException("Result already exists");
        }

        boolean isAbsent = request.getAbsent() != null && request.getAbsent();
        Double marksObtained = isAbsent ? null : request.getMarksObtained();
        Double percentage = null;
        ResultStatus status = ResultStatus.PENDING;
        String grade = null;

        if (!isAbsent && marksObtained != null) {
            percentage = (marksObtained / exam.getMaxMarks()) * 100;
            status = marksObtained >= exam.getPassingMarks() ? ResultStatus.PASS : ResultStatus.FAIL;
            grade = calculateGrade(percentage);
        } else if (isAbsent) {
            status = ResultStatus.ABSENT;
        }

        ExamResult result = ExamResult.builder()
                .schoolId(schoolId)
                .exam(exam)
                .student(student)
                .marksObtained(marksObtained)
                .maxMarks(exam.getMaxMarks())
                .percentage(percentage)
                .grade(grade)
                .status(status)
                .remarks(request.getRemarks())
                .absent(isAbsent)
                .build();

        ExamResult savedResult = examResultRepository.save(result);
        return examMapper.toResultDTO(savedResult);
    }

    @Override
    @Transactional
    public ExamResultDTO updateResult(UUID id, UpdateExamResultRequest request) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        ExamResult result = examResultRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new RuntimeException("Exam result not found"));

        if (request.getMarksObtained() != null) {
            result.setMarksObtained(request.getMarksObtained());
            Double percentage = (request.getMarksObtained() / result.getMaxMarks()) * 100;
            result.setPercentage(percentage);
            result.setGrade(calculateGrade(percentage));
            result.setStatus(request.getMarksObtained() >= result.getExam().getPassingMarks() ? ResultStatus.PASS : ResultStatus.FAIL);
        }

        if (request.getAbsent() != null && request.getAbsent()) {
            result.setAbsent(true);
            result.setMarksObtained(null);
            result.setPercentage(null);
            result.setGrade(null);
            result.setStatus(ResultStatus.ABSENT);
        }

        if (request.getRemarks() != null) {
            result.setRemarks(request.getRemarks());
        }

        return examMapper.toResultDTO(examResultRepository.save(result));
    }

    @Override
    @Transactional
    public void deleteResult(UUID id) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        ExamResult result = examResultRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new RuntimeException("Exam result not found"));
        examResultRepository.delete(result);
    }

    @Override
    public Page<ExamResultDTO> getResultsByExam(String examId, Pageable pageable) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        List<ExamResult> results = examResultRepository.findBySchoolIdAndExamId(schoolId, UUID.fromString(examId));
        return convertListToPage(results, pageable);
    }

    @Override
    public Page<ExamResultDTO> getResultsByStudent(String studentId, Pageable pageable) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        List<ExamResult> results = examResultRepository.findBySchoolIdAndStudentId(schoolId, UUID.fromString(studentId));
        return convertListToPage(results, pageable);
    }

    @Override
    public Page<ExamResultDTO> getResultsByStatus(ResultStatus status, Pageable pageable) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        return examResultRepository.findBySchoolIdAndStatus(schoolId, status, pageable)
                .map(examMapper::toResultDTO);
    }

    @Override
    public Page<ExamResultDTO> searchResults(String keyword, Pageable pageable) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        return examResultRepository.findBySchoolId(schoolId, pageable)
                .map(examMapper::toResultDTO);
    }

    @Override
    public ResultStatisticsDTO getExamStatistics(UUID examId) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        
        List<ExamResult> results = examResultRepository.findBySchoolIdAndExamId(schoolId, examId);
        long total = results.size();
        long pass = results.stream().filter(r -> r.getStatus() == ResultStatus.PASS).count();
        long fail = results.stream().filter(r -> r.getStatus() == ResultStatus.FAIL).count();
        long absent = results.stream().filter(r -> r.getAbsent() != null && r.getAbsent()).count();
        long pending = results.stream().filter(r -> r.getStatus() == ResultStatus.PENDING).count();
        
        Double avgPercentage = results.stream()
                .filter(r -> r.getPercentage() != null)
                .mapToDouble(ExamResult::getPercentage)
                .average()
                .orElse(0.0);
        
        Double highest = results.stream()
                .filter(r -> r.getMarksObtained() != null)
                .mapToDouble(ExamResult::getMarksObtained)
                .max()
                .orElse(0.0);
        
        Double lowest = results.stream()
                .filter(r -> r.getMarksObtained() != null)
                .mapToDouble(ExamResult::getMarksObtained)
                .min()
                .orElse(0.0);
        
        return ResultStatisticsDTO.builder()
                .totalResults(total)
                .passCount(pass)
                .failCount(fail)
                .absentCount(absent)
                .pendingCount(pending)
                .averagePercentage(avgPercentage)
                .highestMarks(highest)
                .lowestMarks(lowest)
                .build();
    }

    @Override
    public ResultStatisticsDTO getOverallStatistics() {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        Page<ExamResult> allResults = examResultRepository.findBySchoolId(schoolId, Pageable.unpaged());
        
        long total = allResults.getTotalElements();
        long pass = allResults.stream().filter(r -> r.getStatus() == ResultStatus.PASS).count();
        long fail = allResults.stream().filter(r -> r.getStatus() == ResultStatus.FAIL).count();
        long absent = allResults.stream().filter(r -> r.getAbsent() != null && r.getAbsent()).count();
        long pending = allResults.stream().filter(r -> r.getStatus() == ResultStatus.PENDING).count();
        
        Double avgPercentage = allResults.stream()
                .filter(r -> r.getPercentage() != null)
                .mapToDouble(ExamResult::getPercentage)
                .average()
                .orElse(0.0);
        
        Double highest = allResults.stream()
                .filter(r -> r.getMarksObtained() != null)
                .mapToDouble(ExamResult::getMarksObtained)
                .max()
                .orElse(0.0);
        
        Double lowest = allResults.stream()
                .filter(r -> r.getMarksObtained() != null)
                .mapToDouble(ExamResult::getMarksObtained)
                .min()
                .orElse(0.0);
        
        return ResultStatisticsDTO.builder()
                .totalResults(total)
                .passCount(pass)
                .failCount(fail)
                .absentCount(absent)
                .pendingCount(pending)
                .averagePercentage(avgPercentage)
                .highestMarks(highest)
                .lowestMarks(lowest)
                .build();
    }

    private String calculateGrade(Double percentage) {
        if (percentage == null) return null;
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C+";
        if (percentage >= 40) return "C";
        if (percentage >= 30) return "D";
        return "F";
    }

    private Page<ExamResultDTO> convertListToPage(List<ExamResult> results, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), results.size());
        List<ExamResultDTO> dtos = results.subList(start, end).stream()
                .map(examMapper::toResultDTO)
                .toList();
        return new org.springframework.data.domain.PageImpl<>(dtos, pageable, results.size());
    }
}
