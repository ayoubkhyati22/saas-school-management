package com.school.saas.module.chat.controller;

import com.school.saas.module.chat.dto.ChatMessageDTO;
import com.school.saas.module.chat.dto.SendMessageRequest;
import com.school.saas.module.chat.service.ChatService;
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
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Chat management endpoints")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/messages")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Send a message", description = "Send a message in a course chat")
    public ResponseEntity<ChatMessageDTO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        ChatMessageDTO message = chatService.sendMessage(request);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    @GetMapping("/course/{courseId}/messages")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get messages by course", description = "Retrieve all messages for a specific course")
    public ResponseEntity<List<ChatMessageDTO>> getMessagesByCourse(@PathVariable UUID courseId) {
        List<ChatMessageDTO> messages = chatService.getMessagesByCourse(courseId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/course/{courseId}/messages/paginated")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get paginated messages by course", description = "Retrieve paginated messages for a specific course")
    public ResponseEntity<Page<ChatMessageDTO>> getMessagesByCoursePaginated(
            @PathVariable UUID courseId,
            Pageable pageable) {
        Page<ChatMessageDTO> messages = chatService.getMessagesByCourse(courseId, pageable);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/messages/{messageId}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Delete a message", description = "Delete a message (sender or teacher only)")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID messageId) {
        chatService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/course/{courseId}/count")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    @Operation(summary = "Get message count", description = "Get the total number of messages in a course")
    public ResponseEntity<Long> getMessageCount(@PathVariable UUID courseId) {
        long count = chatService.getMessageCount(courseId);
        return ResponseEntity.ok(count);
    }
}
