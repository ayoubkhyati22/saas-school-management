package com.school.saas.module.classroom.controller;

import com.school.saas.module.classroom.dto.*;
import com.school.saas.module.classroom.service.ClassRoomService;
import com.school.saas.module.student.dto.StudentDTO;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
@Tag(name = "ClassRoom", description = "Classroom management endpoints")
public class ClassRoomController {

    private final ClassRoomService classRoomService;

    @PostMapping
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new classroom", description = "Create a new classroom (SCHOOL_ADMIN only)")
    public ResponseEntity<ClassRoomDetailDTO> createClassRoom(@Valid @RequestBody CreateClassRoomRequest request) {
        ClassRoomDetailDTO classRoom = classRoomService.create(request);
        return new ResponseEntity<>(classRoom, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update classroom", description = "Update classroom information (SCHOOL_ADMIN only)")
    public ResponseEntity<ClassRoomDetailDTO> updateClassRoom(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateClassRoomRequest request) {
        ClassRoomDetailDTO classRoom = classRoomService.update(id, request);
        return ResponseEntity.ok(classRoom);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get classroom by ID", description = "Retrieve classroom details by ID")
    public ResponseEntity<ClassRoomDetailDTO> getClassRoomById(@PathVariable UUID id) {
        ClassRoomDetailDTO classRoom = classRoomService.getById(id);
        return ResponseEntity.ok(classRoom);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all classrooms", description = "Retrieve all classrooms with pagination")
    public ResponseEntity<Page<ClassRoomDTO>> getAllClassRooms(Pageable pageable) {
        Page<ClassRoomDTO> classRooms = classRoomService.getAll(pageable);
        return ResponseEntity.ok(classRooms);
    }

    @GetMapping("/academic-year/{academicYear}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get classrooms by academic year", description = "Retrieve classrooms for a specific academic year")
    public ResponseEntity<Page<ClassRoomDTO>> getClassRoomsByAcademicYear(
            @PathVariable String academicYear,
            Pageable pageable) {
        Page<ClassRoomDTO> classRooms = classRoomService.getByAcademicYear(academicYear, pageable);
        return ResponseEntity.ok(classRooms);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search classrooms", description = "Search classrooms by name, level, or section")
    public ResponseEntity<Page<ClassRoomDTO>> searchClassRooms(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<ClassRoomDTO> classRooms = classRoomService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(classRooms);
    }

    @PutMapping("/{id}/assign-teacher")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Assign class teacher", description = "Assign a teacher to a classroom (SCHOOL_ADMIN only)")
    public ResponseEntity<ClassRoomDetailDTO> assignClassTeacher(
            @PathVariable UUID id,
            @Valid @RequestBody AssignTeacherRequest request) {
        ClassRoomDetailDTO classRoom = classRoomService.assignClassTeacher(id, request.getTeacherId());
        return ResponseEntity.ok(classRoom);
    }

    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get students in classroom", description = "Retrieve all students in a specific classroom")
    public ResponseEntity<List<StudentDTO>> getStudentsByClassroom(@PathVariable UUID id) {
        List<StudentDTO> students = classRoomService.getStudentsByClassroom(id);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}/statistics")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get classroom statistics", description = "Retrieve statistical data for a classroom")
    public ResponseEntity<ClassRoomStatisticsDTO> getClassroomStatistics(@PathVariable UUID id) {
        ClassRoomStatisticsDTO statistics = classRoomService.getClassroomStatistics(id);
        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete classroom", description = "Delete a classroom (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> deleteClassRoom(@PathVariable UUID id) {
        classRoomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
