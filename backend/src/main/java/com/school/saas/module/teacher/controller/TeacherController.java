package com.school.saas.module.teacher.controller;

import com.school.saas.module.teacher.dto.*;
import com.school.saas.module.teacher.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@Tag(name = "Teacher", description = "Teacher management endpoints")
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new teacher", description = "Create a new teacher account (SCHOOL_ADMIN only)")
    public ResponseEntity<TeacherDetailDTO> createTeacher(@Valid @RequestBody CreateTeacherRequest request) {
        TeacherDetailDTO teacher = teacherService.create(request);
        return new ResponseEntity<>(teacher, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update teacher", description = "Update teacher information (SCHOOL_ADMIN only)")
    public ResponseEntity<TeacherDetailDTO> updateTeacher(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTeacherRequest request) {
        TeacherDetailDTO teacher = teacherService.update(id, request);
        return ResponseEntity.ok(teacher);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get teacher by ID", description = "Retrieve teacher details by ID")
    public ResponseEntity<TeacherDetailDTO> getTeacherById(@PathVariable UUID id) {
        TeacherDetailDTO teacher = teacherService.getById(id);
        return ResponseEntity.ok(teacher);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all teachers", description = "Retrieve all teachers with pagination")
    public ResponseEntity<Page<TeacherDTO>> getAllTeachers(Pageable pageable) {
        Page<TeacherDTO> teachers = teacherService.getAll(pageable);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search teachers", description = "Search teachers by name, employee number, or speciality")
    public ResponseEntity<Page<TeacherDTO>> searchTeachers(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<TeacherDTO> teachers = teacherService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get teachers by status", description = "Retrieve teachers by their status")
    public ResponseEntity<Page<TeacherDTO>> getTeachersByStatus(
            @PathVariable String status,
            Pageable pageable) {
        Page<TeacherDTO> teachers = teacherService.getByStatus(status, pageable);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get teacher statistics", description = "Retrieve statistical data about teachers")
    public ResponseEntity<TeacherStatisticsDTO> getStatistics() {
        TeacherStatisticsDTO statistics = teacherService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete teacher", description = "Mark teacher as terminated (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> deleteTeacher(@PathVariable UUID id) {
        teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
