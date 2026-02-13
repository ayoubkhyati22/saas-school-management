package com.school.saas.module.exam.controller;

import com.school.saas.module.exam.ResultStatus;
import com.school.saas.module.exam.dto.CreateExamResultRequest;
import com.school.saas.module.exam.dto.ExamResultDTO;
import com.school.saas.module.exam.dto.ResultStatisticsDTO;
import com.school.saas.module.exam.dto.UpdateExamResultRequest;
import com.school.saas.module.exam.service.ExamResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/exam-results")
@RequiredArgsConstructor
public class ExamResultController {

    private final ExamResultService examResultService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamResultDTO>> getAllResults(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(examResultService.getAllResults(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ExamResultDTO> getResultById(@PathVariable String id) {
        return ResponseEntity.ok(examResultService.getResultById(UUID.fromString(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamResultDTO> createResult(@Valid @RequestBody CreateExamResultRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examResultService.createResult(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamResultDTO> updateResult(@PathVariable String id, @Valid @RequestBody UpdateExamResultRequest request) {
        return ResponseEntity.ok(examResultService.updateResult(UUID.fromString(id), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteResult(@PathVariable String id) {
        examResultService.deleteResult(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamResultDTO>> getResultsByExam(@PathVariable String examId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(examResultService.getResultsByExam(examId, PageRequest.of(page, size)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamResultDTO>> getResultsByStudent(@PathVariable String studentId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(examResultService.getResultsByStudent(studentId, PageRequest.of(page, size)));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<Page<ExamResultDTO>> getResultsByStatus(@PathVariable ResultStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(examResultService.getResultsByStatus(status, PageRequest.of(page, size)));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamResultDTO>> searchResults(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(examResultService.searchResults(keyword, PageRequest.of(page, size)));
    }

    @GetMapping("/exam/{examId}/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ResultStatisticsDTO> getExamStatistics(@PathVariable String examId) {
        return ResponseEntity.ok(examResultService.getExamStatistics(UUID.fromString(examId)));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ResultStatisticsDTO> getOverallStatistics() {
        return ResponseEntity.ok(examResultService.getOverallStatistics());
    }
}
