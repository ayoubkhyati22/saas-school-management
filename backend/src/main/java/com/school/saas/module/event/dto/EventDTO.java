package com.school.saas.module.event.dto;

import com.school.saas.module.event.entity.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Event details")
public class EventDTO {

    @Schema(description = "Event ID")
    private UUID id;

    @Schema(description = "School ID")
    private UUID schoolId;

    @Schema(description = "Event title")
    private String title;

    @Schema(description = "Event description")
    private String description;

    @Schema(description = "Event type")
    private EventType eventType;

    @Schema(description = "Event date and time")
    private LocalDateTime eventDate;

    @Schema(description = "Event location")
    private String location;

    @Schema(description = "Target role (ALL, STUDENT, TEACHER, PARENT)")
    private String targetRole;

    @Schema(description = "User who created the event")
    private UUID createdBy;

    @Schema(description = "Created at timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at timestamp")
    private LocalDateTime updatedAt;
}
