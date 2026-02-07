package com.school.saas.module.event.controller;

import com.school.saas.module.event.dto.CreateEventRequest;
import com.school.saas.module.event.dto.EventDTO;
import com.school.saas.module.event.dto.UpdateEventRequest;
import com.school.saas.module.event.service.EventService;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Event", description = "Event management endpoints")
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Create a new event")
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody CreateEventRequest request) {
        EventDTO event = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Update an event")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventRequest request) {
        EventDTO event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER')")
    @Operation(summary = "Delete an event")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<EventDTO> getEventById(@PathVariable UUID id) {
        EventDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get upcoming events")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<EventDTO> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/target-role/{targetRole}")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get events by target role")
    public ResponseEntity<List<EventDTO>> getEventsByTargetRole(@PathVariable String targetRole) {
        List<EventDTO> events = eventService.getEventsByTargetRole(targetRole);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get events within a date range")
    public ResponseEntity<List<EventDTO>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<EventDTO> events = eventService.getEventsByDateRange(startDate, endDate);
        return ResponseEntity.ok(events);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get all events (paginated)")
    public ResponseEntity<Page<EventDTO>> getAllEvents(Pageable pageable) {
        Page<EventDTO> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }
}
