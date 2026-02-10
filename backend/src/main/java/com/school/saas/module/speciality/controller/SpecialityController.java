package com.school.saas.module.speciality.controller;

import com.school.saas.module.speciality.dto.CreateSpecialityRequest;
import com.school.saas.module.speciality.dto.SpecialityDTO;
import com.school.saas.module.speciality.dto.UpdateSpecialityRequest;
import com.school.saas.module.speciality.service.SpecialityService;
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
@RequestMapping("/api/specialities")
@RequiredArgsConstructor
@Tag(name = "Speciality", description = "Speciality management endpoints")
public class SpecialityController {

    private final SpecialityService specialityService;

    @PostMapping
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Create a new speciality", description = "Create a new speciality (SCHOOL_ADMIN only)")
    public ResponseEntity<SpecialityDTO> createSpeciality(@Valid @RequestBody CreateSpecialityRequest request) {
        SpecialityDTO speciality = specialityService.create(request);
        return new ResponseEntity<>(speciality, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Update speciality", description = "Update speciality information (SCHOOL_ADMIN only)")
    public ResponseEntity<SpecialityDTO> updateSpeciality(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSpecialityRequest request) {
        SpecialityDTO speciality = specialityService.update(id, request);
        return ResponseEntity.ok(speciality);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get speciality by ID", description = "Retrieve speciality details by ID")
    public ResponseEntity<SpecialityDTO> getSpecialityById(@PathVariable UUID id) {
        SpecialityDTO speciality = specialityService.getById(id);
        return ResponseEntity.ok(speciality);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all specialities", description = "Retrieve all specialities with pagination")
    public ResponseEntity<Page<SpecialityDTO>> getAllSpecialities(Pageable pageable) {
        Page<SpecialityDTO> specialities = specialityService.getAll(pageable);
        return ResponseEntity.ok(specialities);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Get all active specialities", description = "Retrieve all active specialities")
    public ResponseEntity<List<SpecialityDTO>> getAllActiveSpecialities() {
        List<SpecialityDTO> specialities = specialityService.getAllActive();
        return ResponseEntity.ok(specialities);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Search specialities", description = "Search specialities by name or code")
    public ResponseEntity<Page<SpecialityDTO>> searchSpecialities(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<SpecialityDTO> specialities = specialityService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(specialities);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Delete speciality", description = "Delete a speciality (SCHOOL_ADMIN only)")
    public ResponseEntity<Void> deleteSpeciality(@PathVariable UUID id) {
        specialityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Activate speciality", description = "Activate a deactivated speciality")
    public ResponseEntity<Void> activateSpeciality(@PathVariable UUID id) {
        specialityService.activate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    @Operation(summary = "Deactivate speciality", description = "Deactivate an active speciality")
    public ResponseEntity<Void> deactivateSpeciality(@PathVariable UUID id) {
        specialityService.deactivate(id);
        return ResponseEntity.ok().build();
    }
}
