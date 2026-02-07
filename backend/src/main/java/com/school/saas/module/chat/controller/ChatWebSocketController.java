package com.school.saas.module.chat.controller;

import com.school.saas.module.chat.dto.ChatMessageDTO;
import com.school.saas.module.chat.dto.SendMessageRequest;
import com.school.saas.module.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.send/{courseId}")
    @SendTo("/topic/course/{courseId}")
    public ChatMessageDTO sendMessage(
            @DestinationVariable String courseId,
            @Payload SendMessageRequest request,
            SimpMessageHeaderAccessor headerAccessor) {

        log.info("WebSocket message received for course: {}", courseId);

        try {
            // Ensure courseId in request matches the path variable
            request.setCourseId(UUID.fromString(courseId));

            // Send message through service
            ChatMessageDTO message = chatService.sendMessage(request);

            log.info("WebSocket message sent successfully: {}", message.getId());
            return message;

        } catch (Exception e) {
            log.error("Error sending WebSocket message", e);
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }

    @MessageMapping("/chat.join/{courseId}")
    @SendTo("/topic/course/{courseId}")
    public ChatMessageDTO joinCourse(
            @DestinationVariable String courseId,
            SimpMessageHeaderAccessor headerAccessor) {

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        log.info("User {} joined course chat: {}", username, courseId);

        // Create a system message for user joining
        ChatMessageDTO systemMessage = ChatMessageDTO.builder()
                .courseId(UUID.fromString(courseId))
                .message(username + " joined the chat")
                .messageType("SYSTEM")
                .senderName("System")
                .build();

        return systemMessage;
    }

    @MessageMapping("/chat.leave/{courseId}")
    @SendTo("/topic/course/{courseId}")
    public ChatMessageDTO leaveCourse(
            @DestinationVariable String courseId,
            SimpMessageHeaderAccessor headerAccessor) {

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        log.info("User {} left course chat: {}", username, courseId);

        // Create a system message for user leaving
        ChatMessageDTO systemMessage = ChatMessageDTO.builder()
                .courseId(UUID.fromString(courseId))
                .message(username + " left the chat")
                .messageType("SYSTEM")
                .senderName("System")
                .build();

        return systemMessage;
    }
}
