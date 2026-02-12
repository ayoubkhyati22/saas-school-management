package com.school.saas.module.timetable.controller;

import com.school.saas.module.timetable.dto.*;
import com.school.saas.module.timetable.service.TimetableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/timetables")
@RequiredArgsConstructor
@Tag(name = "Timetable", description = "Timetable management endpoints")
public class TimetableController {

    private final TimetableService timetableService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Create a new timetable entry", description = "Create a new timetable slot (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<TimetableDetailDTO> createTimetable(@Valid @RequestBody CreateTimetableRequest request) {
        TimetableDetailDTO timetable = timetableService.create(request);
        return new ResponseEntity<>(timetable, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Update timetable entry", description = "Update timetable slot information (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<TimetableDetailDTO> updateTimetable(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTimetableRequest request) {
        TimetableDetailDTO timetable = timetableService.update(id, request);
        return ResponseEntity.ok(timetable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get timetable by ID", description = "Retrieve timetable details by ID")
    public ResponseEntity<TimetableDetailDTO> getTimetableById(@PathVariable UUID id) {
        TimetableDetailDTO timetable = timetableService.getById(id);
        return ResponseEntity.ok(timetable);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all timetables", description = "Retrieve all timetables with pagination")
    public ResponseEntity<Page<TimetableDTO>> getAllTimetables(Pageable pageable) {
        Page<TimetableDTO> timetables = timetableService.getAll(pageable);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/classroom/{classRoomId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get timetables by classroom", description = "Retrieve all timetable slots for a specific classroom")
    public ResponseEntity<List<TimetableDTO>> getTimetablesByClassRoom(@PathVariable UUID classRoomId) {
        List<TimetableDTO> timetables = timetableService.getByClassRoom(classRoomId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get timetables by teacher", description = "Retrieve all timetable slots for a specific teacher")
    public ResponseEntity<List<TimetableDTO>> getTimetablesByTeacher(@PathVariable UUID teacherId) {
        List<TimetableDTO> timetables = timetableService.getByTeacher(teacherId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get timetables by course", description = "Retrieve all timetable slots for a specific course")
    public ResponseEntity<List<TimetableDTO>> getTimetablesByCourse(@PathVariable UUID courseId) {
        List<TimetableDTO> timetables = timetableService.getByCourse(courseId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/speciality/{specialityId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get timetables by speciality", description = "Retrieve all timetable slots for a specific speciality")
    public ResponseEntity<List<TimetableDTO>> getTimetablesBySpeciality(@PathVariable UUID specialityId) {
        List<TimetableDTO> timetables = timetableService.getBySpeciality(specialityId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/day/{dayOfWeek}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get timetables by day", description = "Retrieve all timetable slots for a specific day of week")
    public ResponseEntity<List<TimetableDTO>> getTimetablesByDay(@PathVariable DayOfWeek dayOfWeek) {
        List<TimetableDTO> timetables = timetableService.getByDayOfWeek(dayOfWeek);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/academic-year/{academicYear}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get timetables by academic year", description = "Retrieve timetables for a specific academic year")
    public ResponseEntity<Page<TimetableDTO>> getTimetablesByAcademicYear(
            @PathVariable String academicYear,
            Pageable pageable) {
        Page<TimetableDTO> timetables = timetableService.getByAcademicYear(academicYear, pageable);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/semester/{semester}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get timetables by semester", description = "Retrieve timetables for a specific semester")
    public ResponseEntity<Page<TimetableDTO>> getTimetablesBySemester(
            @PathVariable String semester,
            Pageable pageable) {
        Page<TimetableDTO> timetables = timetableService.getBySemester(semester, pageable);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search timetables", description = "Search timetables by keyword")
    public ResponseEntity<Page<TimetableDTO>> searchTimetables(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<TimetableDTO> timetables = timetableService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get timetable statistics", description = "Retrieve statistical data about timetables")
    public ResponseEntity<TimetableStatisticsDTO> getStatistics() {
        TimetableStatisticsDTO statistics = timetableService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Activate timetable", description = "Activate a deactivated timetable slot")
    public ResponseEntity<Void> activateTimetable(@PathVariable UUID id) {
        timetableService.activate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Deactivate timetable", description = "Deactivate an active timetable slot")
    public ResponseEntity<Void> deactivateTimetable(@PathVariable UUID id) {
        timetableService.deactivate(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/export/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Export timetable by teacher", description = "Export timetable for a specific teacher as Excel file")
    public ResponseEntity<byte[]> exportTimetableByTeacher(
            @PathVariable UUID teacherId,
            @RequestParam String academicYear) {
        byte[] excelData = timetableService.exportTimetableByTeacher(teacherId, academicYear);

        String filename = "timetable_teacher_" + teacherId + "_" +
                         LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);

        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }

    @GetMapping("/export/classroom/{classRoomId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Export timetable by classroom", description = "Export timetable for a specific classroom as Excel file")
    public ResponseEntity<byte[]> exportTimetableByClassRoom(
            @PathVariable UUID classRoomId,
            @RequestParam String academicYear) {
        byte[] excelData = timetableService.exportTimetableByClassRoom(classRoomId, academicYear);

        String filename = "timetable_classroom_" + classRoomId + "_" +
                         LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);

        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }

    @GetMapping("/export/course/{courseId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Export timetable by course", description = "Export timetable for a specific course as Excel file")
    public ResponseEntity<byte[]> exportTimetableByCourse(
            @PathVariable UUID courseId,
            @RequestParam String academicYear) {
        byte[] excelData = timetableService.exportTimetableByCourse(courseId, academicYear);

        String filename = "timetable_course_" + courseId + "_" +
                         LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);

        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }

    @GetMapping("/export/speciality/{specialityId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Export timetable by speciality", description = "Export timetable for a specific speciality as Excel file")
    public ResponseEntity<byte[]> exportTimetableBySpeciality(
            @PathVariable UUID specialityId,
            @RequestParam String academicYear) {
        byte[] excelData = timetableService.exportTimetableBySpeciality(specialityId, academicYear);

        String filename = "timetable_speciality_" + specialityId + "_" +
                         LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);

        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Delete timetable", description = "Delete a timetable slot (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<Void> deleteTimetable(@PathVariable UUID id) {
        timetableService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
