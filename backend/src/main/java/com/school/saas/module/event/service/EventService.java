package com.school.saas.module.event.service;

import com.school.saas.module.event.dto.CreateEventRequest;
import com.school.saas.module.event.dto.EventDTO;
import com.school.saas.module.event.dto.UpdateEventRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface EventService {

    EventDTO createEvent(CreateEventRequest request);

    EventDTO updateEvent(UUID id, UpdateEventRequest request);

    void deleteEvent(UUID id);

    EventDTO getEventById(UUID id);

    List<EventDTO> getUpcomingEvents();

    List<EventDTO> getEventsByTargetRole(String targetRole);

    List<EventDTO> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    Page<EventDTO> getAllEvents(Pageable pageable);
}
