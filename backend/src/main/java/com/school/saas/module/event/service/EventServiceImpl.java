package com.school.saas.module.event.service;

import com.school.saas.module.event.dto.CreateEventRequest;
import com.school.saas.module.event.dto.EventDTO;
import com.school.saas.module.event.dto.UpdateEventRequest;
import com.school.saas.module.event.entity.Event;
import com.school.saas.module.event.mapper.EventMapper;
import com.school.saas.module.event.repository.EventRepository;
import com.school.saas.security.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public EventDTO createEvent(CreateEventRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        UUID currentUserId = TenantContext.getCurrentUserId();

        Event event = Event.builder()
                .schoolId(schoolId)
                .title(request.getTitle())
                .description(request.getDescription())
                .eventType(request.getEventType())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .targetRole(request.getTargetRole())
                .createdBy(currentUserId)
                .build();

        event = eventRepository.save(event);
        return eventMapper.toDTO(event);
    }

    @Override
    @Transactional
    public EventDTO updateEvent(UUID id, UpdateEventRequest request) {
        UUID schoolId = TenantContext.getTenantId();

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!event.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Event does not belong to this school");
        }

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getEventType() != null) {
            event.setEventType(request.getEventType());
        }
        if (request.getEventDate() != null) {
            event.setEventDate(request.getEventDate());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        if (request.getTargetRole() != null) {
            event.setTargetRole(request.getTargetRole());
        }

        event = eventRepository.save(event);
        return eventMapper.toDTO(event);
    }

    @Override
    @Transactional
    public void deleteEvent(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!event.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Event does not belong to this school");
        }

        eventRepository.delete(event);
    }

    @Override
    public EventDTO getEventById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!event.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Event does not belong to this school");
        }

        return eventMapper.toDTO(event);
    }

    @Override
    public List<EventDTO> getUpcomingEvents() {
        UUID schoolId = TenantContext.getTenantId();

        List<Event> events = eventRepository.findBySchoolIdAndEventDateAfter(
                schoolId, LocalDateTime.now());

        return events.stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getEventsByTargetRole(String targetRole) {
        UUID schoolId = TenantContext.getTenantId();

        List<Event> events = eventRepository.findUpcomingEventsBySchoolIdAndTargetRole(
                schoolId, targetRole, LocalDateTime.now());

        return events.stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        UUID schoolId = TenantContext.getTenantId();

        List<Event> events = eventRepository.findBySchoolIdAndEventDateBetween(
                schoolId, startDate, endDate);

        return events.stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<EventDTO> getAllEvents(Pageable pageable) {
        // This would need a custom query filtering by schoolId
        return eventRepository.findAll(pageable)
                .map(eventMapper::toDTO);
    }
}
