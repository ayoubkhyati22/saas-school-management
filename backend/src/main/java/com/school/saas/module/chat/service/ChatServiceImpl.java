package com.school.saas.module.chat.service;

import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.chat.ChatMessage;
import com.school.saas.module.chat.dto.ChatMessageDTO;
import com.school.saas.module.chat.dto.SendMessageRequest;
import com.school.saas.module.chat.mapper.ChatMessageMapper;
import com.school.saas.module.chat.repository.ChatMessageRepository;
import com.school.saas.module.course.Course;
import com.school.saas.module.course.repository.CourseRepository;
import com.school.saas.module.student.Student;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ChatMessageMapper chatMessageMapper;

    @Override
    @Transactional
    public ChatMessageDTO sendMessage(SendMessageRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Sending message for course: {} in school: {}", request.getCourseId(), schoolId);

        // Verify course belongs to school
        Course course = courseRepository.findByIdAndSchoolId(request.getCourseId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate user is enrolled in the course (teacher or student in the classroom)
        validateUserAccess(currentUser, course);

        ChatMessage chatMessage = ChatMessage.builder()
                .schoolId(schoolId)
                .course(course)
                .sender(currentUser)
                .message(request.getMessage())
                .messageType(request.getMessageType())
                .filePath(request.getFilePath())
                .timestamp(LocalDateTime.now())
                .build();
        chatMessage = chatMessageRepository.save(chatMessage);

        log.info("Message sent successfully with ID: {}", chatMessage.getId());
        return chatMessageMapper.toDTO(chatMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessagesByCourse(UUID courseId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching messages for course: {} in school: {}", courseId, schoolId);

        // Verify course belongs to school
        courseRepository.findByIdAndSchoolId(courseId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<ChatMessage> messages = chatMessageRepository.findByCourseIdAndSchoolId(courseId, schoolId);
        return messages.stream()
                .map(chatMessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageDTO> getMessagesByCourse(UUID courseId, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching paginated messages for course: {} in school: {}", courseId, schoolId);

        // Verify course belongs to school
        courseRepository.findByIdAndSchoolId(courseId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Page<ChatMessage> messages = chatMessageRepository.findByCourseIdAndSchoolIdOrderByTimestampDesc(
                courseId, schoolId, pageable);
        return messages.map(chatMessageMapper::toDTO);
    }

    @Override
    @Transactional
    public void deleteMessage(UUID messageId) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting message: {} for school: {}", messageId, schoolId);

        ChatMessage message = chatMessageRepository.findByIdAndSchoolId(messageId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only allow sender or teacher to delete
        boolean isSender = message.getSender().getId().equals(currentUser.getId());
        boolean isTeacher = "TEACHER".equals(currentUser.getRole()) || "SCHOOL_ADMIN".equals(currentUser.getRole());

        if (!isSender && !isTeacher) {
            throw new IllegalStateException("You don't have permission to delete this message");
        }

        chatMessageRepository.delete(message);
        log.info("Message deleted successfully: {}", messageId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getMessageCount(UUID courseId) {
        return chatMessageRepository.countByCourseId(courseId);
    }

    private void validateUserAccess(User user, Course course) {
        String role = String.valueOf(user.getRole());

        if ("SCHOOL_ADMIN".equals(role)) {
            return; // Admin has access to all courses
        }

        if ("TEACHER".equals(role)) {
            // Check if user is the course teacher
            Teacher teacher = teacherRepository.findByUserIdAndSchoolId(user.getId(), user.getSchoolId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

            if (!course.getTeacher().getId().equals(teacher.getId())) {
                throw new IllegalStateException("You are not the teacher of this course");
            }
            return;
        }

        if ("STUDENT".equals(role)) {
            // Check if student is in the course's classroom
            Student student = studentRepository.findByUserIdAndSchoolId(user.getId(), user.getSchoolId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

            if (student.getClassRoom() == null ||
                !student.getClassRoom().getId().equals(course.getClassRoom().getId())) {
                throw new IllegalStateException("You are not enrolled in this course");
            }
            return;
        }

        throw new IllegalStateException("Invalid user role for accessing course chat");
    }
}
