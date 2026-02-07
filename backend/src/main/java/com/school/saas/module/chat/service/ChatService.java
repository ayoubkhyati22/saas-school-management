package com.school.saas.module.chat.service;

import com.school.saas.module.chat.dto.ChatMessageDTO;
import com.school.saas.module.chat.dto.SendMessageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    ChatMessageDTO sendMessage(SendMessageRequest request);

    List<ChatMessageDTO> getMessagesByCourse(UUID courseId);

    Page<ChatMessageDTO> getMessagesByCourse(UUID courseId, Pageable pageable);

    void deleteMessage(UUID messageId);

    long getMessageCount(UUID courseId);
}
