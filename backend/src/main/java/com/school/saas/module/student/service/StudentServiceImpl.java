package com.school.saas.module.student.service;

import com.school.saas.common.Gender;
import com.school.saas.common.Role;
import com.school.saas.common.StudentStatus;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.student.Student;
import com.school.saas.module.student.dto.*;
import com.school.saas.module.student.mapper.StudentMapper;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.subscription.SubscriptionLimitService;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassRoomRepository classRoomRepository;
    private final StudentMapper studentMapper;
    private final SubscriptionLimitService subscriptionLimitService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentDetailDTO create(CreateStudentRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating student for school: {}", schoolId);

        // Validate subscription limit
        subscriptionLimitService.validateStudentLimit(schoolId);

        // Check if registration number already exists
        if (studentRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new IllegalArgumentException("Registration number already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Validate classroom if provided
        ClassRoom classRoom = null;
        if (request.getClassRoomId() != null) {
            classRoom = classRoomRepository.findByIdAndSchoolId(request.getClassRoomId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("ClassRoom not found"));
        }

        // Create User account
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode("Student@123")) // Default password
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhoneNumber())
                .role(Role.STUDENT)
                .schoolId(schoolId)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // Create Student
        Student student = Student.builder()
                .user(user)
                .schoolId(schoolId)
                .classRoom(classRoom)
                .registrationNumber(request.getRegistrationNumber())
                .birthDate(request.getBirthDate())
                .gender(Gender.valueOf(request.getGender()))
                .enrollmentDate(request.getEnrollmentDate())
                .status(StudentStatus.ACTIVE)
                .address(request.getAddress())
                .avatarUrl(request.getAvatarUrl())
                .administrativeDocuments(request.getAdministrativeDocuments())
                .build();
        student = studentRepository.save(student);

        log.info("Student created successfully with ID: {}", student.getId());
        return studentMapper.toDetailDTO(student);
    }

    @Override
    @Transactional
    public StudentDetailDTO update(UUID id, UpdateStudentRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating student: {} for school: {}", id, schoolId);

        Student student = studentRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        User user = student.getUser();

        // Update user fields
        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            user.setPhone(request.getPhoneNumber());
        }
        userRepository.save(user);

        // Update student fields
        if (request.getClassRoomId() != null) {
            ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(request.getClassRoomId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("ClassRoom not found"));
            student.setClassRoom(classRoom);
        }
        if (request.getBirthDate() != null) {
            student.setBirthDate(request.getBirthDate());
        }
        if (request.getGender() != null && !request.getGender().isBlank()) {
            try {
                student.setGender(Gender.valueOf(request.getGender()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid gender value: " + request.getGender());
            }
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                student.setStatus(StudentStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + request.getStatus());
            }
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null) {
            student.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getAdministrativeDocuments() != null) {
            student.setAdministrativeDocuments(request.getAdministrativeDocuments());
        }

        student = studentRepository.save(student);
        log.info("Student updated successfully: {}", id);
        return studentMapper.toDetailDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDetailDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching student: {} for school: {}", id, schoolId);

        Student student = studentRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return studentMapper.toDetailDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all students for school: {}", schoolId);

        Page<Student> students = studentRepository.findBySchoolId(schoolId, pageable);
        return students.map(studentMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> findByClassroom(UUID classRoomId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching students for classroom: {} in school: {}", classRoomId, schoolId);

        // Verify classroom belongs to school
        classRoomRepository.findByIdAndSchoolId(classRoomId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassRoom not found"));

        List<Student> students = studentRepository.findByClassRoomId(classRoomId);
        return students.stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching students with keyword: {} for school: {}", keyword, schoolId);

        Page<Student> students = studentRepository.searchByKeyword(schoolId, keyword, pageable);
        return students.map(studentMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting student: {} for school: {}", id, schoolId);

        Student student = studentRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Set user as inactive instead of deleting
        User user = student.getUser();
        user.setEnabled(false);
        userRepository.save(user);

        // Set student status as WITHDRAWN
        student.setStatus(StudentStatus.DROPPED_OUT);
        studentRepository.save(student);

        log.info("Student marked as withdrawn: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentStatisticsDTO getStatistics() {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching statistics for school: {}", schoolId);

        long totalStudents = studentRepository.countBySchoolId(schoolId);

        // FIXED: Pass enum values instead of strings
        long activeStudents = studentRepository.countBySchoolIdAndStatus(schoolId, StudentStatus.ACTIVE);
        long inactiveStudents = totalStudents - activeStudents;
        long maleStudents = studentRepository.countBySchoolIdAndGender(schoolId, Gender.MALE);
        long femaleStudents = studentRepository.countBySchoolIdAndGender(schoolId, Gender.FEMALE);

        // Get students by class
        List<Student> allStudents = studentRepository.findBySchoolId(schoolId);
        Map<String, Long> studentsByClass = allStudents.stream()
                .filter(s -> s.getClassRoom() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getClassRoom().getName(),
                        Collectors.counting()
                ));

        Map<String, Long> studentsByGender = new HashMap<>();
        studentsByGender.put("MALE", maleStudents);
        studentsByGender.put("FEMALE", femaleStudents);
        studentsByGender.put("OTHER", totalStudents - maleStudents - femaleStudents);

        return StudentStatisticsDTO.builder()
                .totalStudents(totalStudents)
                .activeStudents(activeStudents)
                .inactiveStudents(inactiveStudents)
                .maleStudents(maleStudents)
                .femaleStudents(femaleStudents)
                .studentsByClass(studentsByClass)
                .studentsByGender(studentsByGender)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public long countByClassroom(UUID classRoomId) {
        return studentRepository.countByClassRoomId(classRoomId);
    }
}