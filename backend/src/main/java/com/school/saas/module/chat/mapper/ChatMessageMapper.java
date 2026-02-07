package com.school.saas.module.chat.mapper;

import com.school.saas.module.chat.ChatMessage;
import com.school.saas.module.chat.dto.ChatMessageDTO;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {

    public ChatMessageDTO toDTO(ChatMessage chatMessage) {
        if (chatMessage == null) {
            return null;
        }

        String senderName = null;
        String senderRole = null;
        if (chatMessage.getSender() != null) {
            senderName = chatMessage.getSender().getFirstName() + " " +
                        chatMessage.getSender().getLastName();
            senderRole = chatMessage.getSender().getRole().name();
        }

        return ChatMessageDTO.builder()
                .id(chatMessage.getId())
                .schoolId(chatMessage.getSchoolId())
                .courseId(chatMessage.getCourse() != null ? chatMessage.getCourse().getId() : null)
                .senderId(chatMessage.getSender() != null ? chatMessage.getSender().getId() : null)
                .senderName(senderName)
                .senderRole(senderRole)
                .message(chatMessage.getMessage())
                .messageType(chatMessage.getMessageType())
                .filePath(chatMessage.getFilePath())
                .timestamp(chatMessage.getTimestamp())
                .createdAt(chatMessage.getCreatedAt())
                .build();
    }
}
