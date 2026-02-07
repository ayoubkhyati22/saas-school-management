package com.school.saas.module.course.controller;

import com.school.saas.module.course.dto.*;
import com.school.saas.module.course.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Course", description = "Course management endpoints")
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Create a new course", description = "Create a new course (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<CourseDetailDTO> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        CourseDetailDTO course = courseService.create(request);
        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Update course", description = "Update course information (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<CourseDetailDTO> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCourseRequest request) {
        CourseDetailDTO course = courseService.update(id, request);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get course by ID", description = "Retrieve course details by ID")
    public ResponseEntity<CourseDetailDTO> getCourseById(@PathVariable UUID id) {
        CourseDetailDTO course = courseService.getById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all courses", description = "Retrieve all courses with pagination")
    public ResponseEntity<Page<CourseDTO>> getAllCourses(Pageable pageable) {
        Page<CourseDTO> courses = courseService.getAll(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/classroom/{classRoomId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get courses by classroom", description = "Retrieve all courses for a specific classroom")
    public ResponseEntity<List<CourseDTO>> getCoursesByClassroom(@PathVariable UUID classRoomId) {
        List<CourseDTO> courses = courseService.getByClassroom(classRoomId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get courses by teacher", description = "Retrieve all courses for a specific teacher")
    public ResponseEntity<List<CourseDTO>> getCoursesByTeacher(@PathVariable UUID teacherId) {
        List<CourseDTO> courses = courseService.getByTeacher(teacherId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search courses", description = "Search courses by subject or subject code")
    public ResponseEntity<Page<CourseDTO>> searchCourses(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<CourseDTO> courses = courseService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/semester/{semester}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get courses by semester", description = "Retrieve courses for a specific semester")
    public ResponseEntity<Page<CourseDTO>> getCoursesBySemester(
            @PathVariable String semester,
            Pageable pageable) {
        Page<CourseDTO> courses = courseService.getBySemester(semester, pageable);
        return ResponseEntity.ok(courses);
    }

    @PostMapping(value = "/{courseId}/materials", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Upload course material", description = "Upload a file as course material (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<CourseMaterialDTO> uploadMaterial(
            @PathVariable UUID courseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) {
        UploadMaterialRequest request = UploadMaterialRequest.builder()
                .title(title)
                .build();
        CourseMaterialDTO material = courseService.uploadMaterial(courseId, file, request);
        return new ResponseEntity<>(material, HttpStatus.CREATED);
    }

    @GetMapping("/{courseId}/materials")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get course materials", description = "Retrieve all materials for a course")
    public ResponseEntity<List<CourseMaterialDTO>> getMaterialsByCourse(@PathVariable UUID courseId) {
        List<CourseMaterialDTO> materials = courseService.getMaterialsByCourse(courseId);
        return ResponseEntity.ok(materials);
    }

    @DeleteMapping("/materials/{materialId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Delete course material", description = "Delete a course material (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<Void> deleteMaterial(@PathVariable UUID materialId) {
        courseService.deleteMaterial(materialId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Delete course", description = "Delete a course (SCHOOL_ADMIN, TEACHER)")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
