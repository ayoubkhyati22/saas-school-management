package com.school.saas.module.event.dto;

import com.school.saas.module.event.entity.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request to create an event")
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    @Schema(description = "Event title", required = true)
    private String title;

    @Schema(description = "Event description")
    private String description;

    @NotNull(message = "Event type is required")
    @Schema(description = "Event type", required = true)
    private EventType eventType;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    @Schema(description = "Event date and time", required = true)
    private LocalDateTime eventDate;

    @Schema(description = "Event location")
    private String location;

    @NotBlank(message = "Target role is required")
    @Schema(description = "Target role (ALL, STUDENT, TEACHER, PARENT)", required = true)
    private String targetRole;

    @Schema(description = "Event image URL")
    private String imageUrl;
}
