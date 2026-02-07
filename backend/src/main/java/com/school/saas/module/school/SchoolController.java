package com.school.saas.module.school;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
@Tag(name = "School Management", description = "APIs for managing schools")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SchoolController {

    private final SchoolService schoolService;

    @PostMapping
    @Operation(summary = "Create a new school", description = "Creates a new school in the system")
    public ResponseEntity<SchoolDTO> createSchool(@Valid @RequestBody CreateSchoolRequest request) {
        SchoolDTO created = schoolService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a school", description = "Updates an existing school by ID")
    public ResponseEntity<SchoolDTO> updateSchool(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSchoolRequest request) {
        SchoolDTO updated = schoolService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get school by ID", description = "Retrieves a school by its ID")
    public ResponseEntity<SchoolDTO> getSchoolById(@PathVariable UUID id) {
        SchoolDTO school = schoolService.getById(id);
        return ResponseEntity.ok(school);
    }

    @GetMapping("/{id}/details")
    @Operation(summary = "Get school details", description = "Retrieves detailed information about a school")
    public ResponseEntity<SchoolDetailDTO> getSchoolDetails(@PathVariable UUID id) {
        SchoolDetailDTO details = schoolService.getDetailById(id);
        return ResponseEntity.ok(details);
    }

    @GetMapping
    @Operation(summary = "Get all schools", description = "Retrieves all schools with pagination")
    public ResponseEntity<Page<SchoolDTO>> getAllSchools(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<SchoolDTO> schools = schoolService.getAll(pageable);
        return ResponseEntity.ok(schools);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active schools", description = "Retrieves all active schools")
    public ResponseEntity<List<SchoolDTO>> getAllActiveSchools() {
        List<SchoolDTO> schools = schoolService.getAllActive();
        return ResponseEntity.ok(schools);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a school", description = "Deletes a school by ID")
    public ResponseEntity<Void> deleteSchool(@PathVariable UUID id) {
        schoolService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a school", description = "Activates a deactivated school")
    public ResponseEntity<Void> activateSchool(@PathVariable UUID id) {
        schoolService.activate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a school", description = "Deactivates an active school")
    public ResponseEntity<Void> deactivateSchool(@PathVariable UUID id) {
        schoolService.deactivate(id);
        return ResponseEntity.ok().build();
    }
}
