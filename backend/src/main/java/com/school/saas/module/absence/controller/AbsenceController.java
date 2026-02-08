package com.school.saas.module.absence.controller;

import com.school.saas.module.absence.dto.*;
import com.school.saas.module.absence.service.AbsenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
@Tag(name = "Absence", description = "Absence management endpoints")
public class AbsenceController {

    private final AbsenceService absenceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'SCHOOL_ADMIN')")
    @Operation(summary = "Mark a student absence", description = "Teachers can mark student absences")
    public ResponseEntity<AbsenceDTO> markAbsence(@Valid @RequestBody CreateAbsenceRequest request) {
        AbsenceDTO absence = absenceService.markAbsence(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(absence);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'SCHOOL_ADMIN')")
    @Operation(summary = "Update an absence record")
    public ResponseEntity<AbsenceDTO> updateAbsence(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAbsenceRequest request) {
        AbsenceDTO absence = absenceService.updateAbsence(id, request);
        return ResponseEntity.ok(absence);
    }

    @PutMapping("/{id}/justify")
    @PreAuthorize("hasAnyRole('STUDENT', 'PARENT', 'SCHOOL_ADMIN')")
    @Operation(summary = "Justify an absence", description = "Students, parents, or admins can justify absences")
    public ResponseEntity<AbsenceDTO> justifyAbsence(
            @PathVariable UUID id,
            @Valid @RequestBody JustifyAbsenceRequest request) {
        AbsenceDTO absence = absenceService.justifyAbsence(id, request);
        return ResponseEntity.ok(absence);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'SCHOOL_ADMIN')")
    @Operation(summary = "Delete an absence record")
    public ResponseEntity<Void> deleteAbsence(@PathVariable UUID id) {
        absenceService.deleteAbsence(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT', 'PARENT', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get absence by ID")
    public ResponseEntity<AbsenceDTO> getAbsenceById(@PathVariable UUID id) {
        AbsenceDTO absence = absenceService.getAbsenceById(id);
        return ResponseEntity.ok(absence);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT', 'PARENT', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get all absences for a student")
    public ResponseEntity<List<AbsenceDTO>> getAbsencesByStudent(@PathVariable UUID studentId) {
        List<AbsenceDTO> absences = absenceService.getAbsencesByStudent(studentId);
        return ResponseEntity.ok(absences);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT', 'PARENT', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get absences for a student in a specific course")
    public ResponseEntity<List<AbsenceDTO>> getAbsencesByStudentAndCourse(
            @PathVariable UUID studentId,
            @PathVariable UUID courseId) {
        List<AbsenceDTO> absences = absenceService.getAbsencesByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(absences);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get all absences (paginated)")
    public ResponseEntity<Page<AbsenceDTO>> getAllAbsences(Pageable pageable) {
        Page<AbsenceDTO> absences = absenceService.getAllAbsences(pageable);
        return ResponseEntity.ok(absences);
    }

    @GetMapping("/statistics/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT', 'PARENT', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get absence statistics for a student")
    public ResponseEntity<AbsenceStatisticsDTO> getAbsenceStatistics(
            @PathVariable UUID studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        AbsenceStatisticsDTO statistics = absenceService.getAbsenceStatistics(studentId, startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('TEACHER', 'SCHOOL_ADMIN')")
    @Operation(summary = "Get absences within a date range")
    public ResponseEntity<List<AbsenceDTO>> getAbsencesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AbsenceDTO> absences = absenceService.getAbsencesByDateRange(startDate, endDate);
        return ResponseEntity.ok(absences);
    }
}
