package com.school.saas.module.student.controller;

import com.school.saas.dto.ApiResponse;
import com.school.saas.module.student.dto.*;
import com.school.saas.module.student.service.StudentService;
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
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Student", description = "Student management endpoints")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new student", description = "Create a new student account (SCHOOL_ADMIN only)")
    public ResponseEntity<StudentDetailDTO> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        StudentDetailDTO student = studentService.create(request);
        return new ResponseEntity<>(student, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update student", description = "Update student information (SCHOOL_ADMIN only)")
    public ResponseEntity<StudentDetailDTO> updateStudent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStudentRequest request) {
        StudentDetailDTO student = studentService.update(id, request);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get student by ID", description = "Retrieve student details by ID")
    public ResponseEntity<StudentDetailDTO> getStudentById(@PathVariable UUID id) {
        StudentDetailDTO student = studentService.getById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all students", description = "Retrieve all students with pagination")
    public ResponseEntity<Page<StudentDTO>> getAllStudents(Pageable pageable) {
        Page<StudentDTO> students = studentService.getAll(pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/classroom/{classRoomId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get students by classroom", description = "Retrieve all students in a specific classroom")
    public ResponseEntity<List<StudentDTO>> getStudentsByClassroom(@PathVariable UUID classRoomId) {
        List<StudentDTO> students = studentService.findByClassroom(classRoomId);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search students", description = "Search students by name or registration number")
    public ResponseEntity<Page<StudentDTO>> searchStudents(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<StudentDTO> students = studentService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get student statistics", description = "Retrieve statistical data about students")
    public ResponseEntity<StudentStatisticsDTO> getStatistics() {
        StudentStatisticsDTO statistics = studentService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete student", description = "Mark student as withdrawn (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Export students to CSV", description = "Export all students to CSV format")
    public ResponseEntity<byte[]> exportStudents() {
        byte[] csvData = studentService.exportToCSV();

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "students_export_" + timestamp + ".csv";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("no-cache, no-store, must-revalidate");

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Upload student avatar", description = "Upload avatar image for a student")
    public ResponseEntity<ApiResponse<StudentDetailDTO>> uploadAvatar(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        StudentDetailDTO student = studentService.uploadAvatar(id, file);
        return ResponseEntity.ok(ApiResponse.success(student));
    }
}
