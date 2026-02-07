package com.school.saas.module.event.mapper;

import com.school.saas.module.event.dto.EventDTO;
import com.school.saas.module.event.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventDTO toDTO(Event event) {
        if (event == null) {
            return null;
        }

        return EventDTO.builder()
                .id(event.getId())
                .schoolId(event.getSchoolId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventType(event.getEventType())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .targetRole(event.getTargetRole())
                .createdBy(event.getCreatedBy())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
