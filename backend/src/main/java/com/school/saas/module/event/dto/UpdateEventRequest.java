package com.school.saas.module.event.dto;

import com.school.saas.module.event.entity.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to update an event")
public class UpdateEventRequest {

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

    @Schema(description = "Event image URL")
    private String imageUrl;
}
