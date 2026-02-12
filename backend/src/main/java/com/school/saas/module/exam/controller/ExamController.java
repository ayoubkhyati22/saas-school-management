package com.school.saas.module.exam.controller;

import com.school.saas.module.exam.ExamStatus;
import com.school.saas.module.exam.ExamType;
import com.school.saas.module.exam.dto.*;
import com.school.saas.module.exam.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamDTO>> getAllExams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "examDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ExamDTO> exams = examService.getAllExams(pageable);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ExamDTO> getExamById(@PathVariable String id) {
        ExamDTO exam = examService.getExamById(UUID.fromString(id));
        return ResponseEntity.ok(exam);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDTO> createExam(@Valid @RequestBody CreateExamRequest request) {
        ExamDTO exam = examService.createExam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(exam);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDTO> updateExam(
            @PathVariable String id,
            @Valid @RequestBody UpdateExamRequest request) {
        ExamDTO exam = examService.updateExam(UUID.fromString(id), request);
        return ResponseEntity.ok(exam);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<Void> deleteExam(@PathVariable String id) {
        examService.deleteExam(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/classroom/{classRoomId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ExamDTO>> getExamsByClassroom(@PathVariable String classRoomId) {
        List<ExamDTO> exams = examService.getExamsByClassroom(classRoomId);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ExamDTO>> getExamsByCourse(@PathVariable String courseId) {
        List<ExamDTO> exams = examService.getExamsByCourse(courseId);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<List<ExamDTO>> getExamsByTeacher(@PathVariable String teacherId) {
        List<ExamDTO> exams = examService.getExamsByTeacher(teacherId);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/speciality/{specialityId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ExamDTO>> getExamsBySpeciality(@PathVariable String specialityId) {
        List<ExamDTO> exams = examService.getExamsBySpeciality(specialityId);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/type/{examType}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamDTO>> getExamsByType(
            @PathVariable ExamType examType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExamDTO> exams = examService.getExamsByType(examType, pageable);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<Page<ExamDTO>> getExamsByStatus(
            @PathVariable ExamStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExamDTO> exams = examService.getExamsByStatus(status, pageable);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/academic-year/{academicYear}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamDTO>> getExamsByAcademicYear(
            @PathVariable String academicYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExamDTO> exams = examService.getExamsByAcademicYear(academicYear, pageable);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/semester/{semester}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamDTO>> getExamsBySemester(
            @PathVariable String semester,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExamDTO> exams = examService.getExamsBySemester(semester, pageable);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ExamDTO>> getExamsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ExamDTO> exams = examService.getExamsByDateRange(startDate, endDate);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Page<ExamDTO>> searchExams(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExamDTO> exams = examService.searchExams(keyword, pageable);
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/{id}/publish-results")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDTO> publishResults(@PathVariable String id) {
        ExamDTO exam = examService.publishResults(UUID.fromString(id));
        return ResponseEntity.ok(exam);
    }

    @PostMapping("/{id}/unpublish-results")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDTO> unpublishResults(@PathVariable String id) {
        ExamDTO exam = examService.unpublishResults(UUID.fromString(id));
        return ResponseEntity.ok(exam);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDTO> updateExamStatus(
            @PathVariable String id,
            @RequestParam ExamStatus status) {
        ExamDTO exam = examService.updateExamStatus(UUID.fromString(id), status);
        return ResponseEntity.ok(exam);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<ExamStatisticsDTO> getExamStatistics() {
        ExamStatisticsDTO statistics = examService.getExamStatistics();
        return ResponseEntity.ok(statistics);
    }
}
