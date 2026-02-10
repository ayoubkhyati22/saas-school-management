package com.school.saas.module.teacher.controller;

import com.school.saas.module.teacher.dto.*;
import com.school.saas.module.teacher.service.TeacherService;
import com.school.saas.security.TenantContext;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.module.teacher.Teacher;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@Tag(name = "Teacher", description = "Teacher management endpoints")
public class TeacherController {

    private final TeacherService teacherService;
    private final TeacherRepository teacherRepository;

    // POST - Create teacher
    @PostMapping
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new teacher", description = "Create a new teacher account (SCHOOL_ADMIN only)")
    public ResponseEntity<TeacherDetailDTO> createTeacher(@Valid @RequestBody CreateTeacherRequest request) {
        TeacherDetailDTO teacher = teacherService.create(request);
        return new ResponseEntity<>(teacher, HttpStatus.CREATED);
    }

    // GET - List all teachers (with pagination)
    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all teachers", description = "Retrieve all teachers with pagination")
    public ResponseEntity<Page<TeacherDTO>> getAllTeachers(Pageable pageable) {
        Page<TeacherDTO> teachers = teacherService.getAll(pageable);
        return ResponseEntity.ok(teachers);
    }

    // GET /search - Search teachers (SPECIFIC PATH - BEFORE /{id})
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search teachers", description = "Search teachers by name, employee number, or speciality")
    public ResponseEntity<Page<TeacherDTO>> searchTeachers(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<TeacherDTO> teachers = teacherService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(teachers);
    }

    // GET /statistics - Statistics (SPECIFIC PATH - BEFORE /{id})
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get teacher statistics", description = "Retrieve statistical data about teachers")
    public ResponseEntity<TeacherStatisticsDTO> getStatistics() {
        TeacherStatisticsDTO statistics = teacherService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    // GET /export - Export to CSV (SPECIFIC PATH - BEFORE /{id})
    @GetMapping("/export")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Export teachers to CSV", description = "Export all teachers to CSV file")
    public void exportTeachers(HttpServletResponse response) throws IOException {
        UUID schoolId = TenantContext.getTenantId();

        response.setContentType("text/csv");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"teachers_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv\"");

        List<Teacher> teachers = teacherRepository.findBySchoolId(schoolId);

        PrintWriter writer = response.getWriter();

        // CSV Header
        writer.println("Employee Number,First Name,Last Name,Email,Phone,Speciality,Status,Hire Date,Salary");

        // CSV Data
        for (Teacher teacher : teachers) {
            writer.println(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"",
                    teacher.getEmployeeNumber() != null ? teacher.getEmployeeNumber() : "",
                    teacher.getUser() != null && teacher.getUser().getFirstName() != null ? teacher.getUser().getFirstName() : "",
                    teacher.getUser() != null && teacher.getUser().getLastName() != null ? teacher.getUser().getLastName() : "",
                    teacher.getUser() != null && teacher.getUser().getEmail() != null ? teacher.getUser().getEmail() : "",
                    teacher.getUser() != null && teacher.getUser().getPhone() != null ? teacher.getUser().getPhone() : "",
                    teacher.getSpeciality() != null ? teacher.getSpeciality().getName() : "",
                    teacher.getStatus() != null ? teacher.getStatus().toString() : "",
                    teacher.getHireDate() != null ? teacher.getHireDate().toString() : "",
                    teacher.getSalary() != null ? teacher.getSalary().toString() : ""
            ));
        }

        writer.flush();
    }

    // GET /status/{status} - By status (SPECIFIC PATH - BEFORE /{id})
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Get teachers by status", description = "Retrieve teachers by their status")
    public ResponseEntity<Page<TeacherDTO>> getTeachersByStatus(
            @PathVariable String status,
            Pageable pageable) {
        Page<TeacherDTO> teachers = teacherService.getByStatus(status, pageable);
        return ResponseEntity.ok(teachers);
    }

    // GET /{id} - Get by ID (GENERIC PATH - MUST BE LAST!)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get teacher by ID", description = "Retrieve teacher details by ID")
    public ResponseEntity<TeacherDetailDTO> getTeacherById(@PathVariable UUID id) {
        TeacherDetailDTO teacher = teacherService.getById(id);
        return ResponseEntity.ok(teacher);
    }

    // PUT /{id} - Update teacher
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update teacher", description = "Update teacher information (SCHOOL_ADMIN only)")
    public ResponseEntity<TeacherDetailDTO> updateTeacher(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTeacherRequest request) {
        TeacherDetailDTO teacher = teacherService.update(id, request);
        return ResponseEntity.ok(teacher);
    }

    // DELETE /{id} - Delete teacher
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete teacher", description = "Mark teacher as terminated (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> deleteTeacher(@PathVariable UUID id) {
        teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}