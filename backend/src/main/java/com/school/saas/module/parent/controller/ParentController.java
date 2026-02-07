package com.school.saas.module.parent.controller;

import com.school.saas.module.parent.dto.*;
import com.school.saas.module.parent.service.ParentService;
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
@RequestMapping("/api/parents")
@RequiredArgsConstructor
@Tag(name = "Parent", description = "Parent management endpoints")
public class ParentController {

    private final ParentService parentService;

    @PostMapping
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new parent", description = "Create a new parent account (SCHOOL_ADMIN only)")
    public ResponseEntity<ParentDetailDTO> createParent(@Valid @RequestBody CreateParentRequest request) {
        ParentDetailDTO parent = parentService.create(request);
        return new ResponseEntity<>(parent, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update parent", description = "Update parent information (SCHOOL_ADMIN only)")
    public ResponseEntity<ParentDetailDTO> updateParent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateParentRequest request) {
        ParentDetailDTO parent = parentService.update(id, request);
        return ResponseEntity.ok(parent);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get parent by ID", description = "Retrieve parent details by ID")
    public ResponseEntity<ParentDetailDTO> getParentById(@PathVariable UUID id) {
        ParentDetailDTO parent = parentService.getById(id);
        return ResponseEntity.ok(parent);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all parents", description = "Retrieve all parents with pagination")
    public ResponseEntity<Page<ParentDTO>> getAllParents(Pageable pageable) {
        Page<ParentDTO> parents = parentService.getAll(pageable);
        return ResponseEntity.ok(parents);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search parents", description = "Search parents by name or email")
    public ResponseEntity<Page<ParentDTO>> searchParents(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<ParentDTO> parents = parentService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(parents);
    }

    @PostMapping("/{parentId}/students")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Link student to parent", description = "Link a student to a parent (SCHOOL_ADMIN only)")
    public ResponseEntity<ParentStudentDTO> linkStudent(
            @PathVariable UUID parentId,
            @Valid @RequestBody LinkStudentRequest request) {
        ParentStudentDTO parentStudent = parentService.linkStudent(parentId, request);
        return new ResponseEntity<>(parentStudent, HttpStatus.CREATED);
    }

    @DeleteMapping("/{parentId}/students/{studentId}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Unlink student from parent", description = "Unlink a student from a parent (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> unlinkStudent(
            @PathVariable UUID parentId,
            @PathVariable UUID studentId) {
        parentService.unlinkStudent(parentId, studentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{parentId}/students")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'PARENT')")
    @Operation(summary = "Get children of parent", description = "Retrieve all students linked to a parent")
    public ResponseEntity<List<ParentStudentDTO>> getChildren(@PathVariable UUID parentId) {
        List<ParentStudentDTO> children = parentService.getChildren(parentId);
        return ResponseEntity.ok(children);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get parents of student", description = "Retrieve all parents linked to a student")
    public ResponseEntity<List<ParentDTO>> getParentsByStudent(@PathVariable UUID studentId) {
        List<ParentDTO> parents = parentService.getParentsByStudent(studentId);
        return ResponseEntity.ok(parents);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete parent", description = "Mark parent as inactive (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> deleteParent(@PathVariable UUID id) {
        parentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
