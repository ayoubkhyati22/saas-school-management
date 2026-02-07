package com.school.saas.module.teacher.service;

import com.school.saas.common.Role;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.dto.*;
import com.school.saas.module.teacher.mapper.TeacherMapper;
import com.school.saas.module.teacher.repository.TeacherRepository;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final TeacherMapper teacherMapper;
    private final SubscriptionLimitService subscriptionLimitService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public TeacherDetailDTO create(CreateTeacherRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating teacher for school: {}", schoolId);

        // Validate subscription limit
        subscriptionLimitService.validateTeacherLimit(schoolId);

        // Check if employee number already exists
        if (teacherRepository.existsByEmployeeNumber(request.getEmployeeNumber())) {
            throw new IllegalArgumentException("Employee number already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create User account
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode("Teacher@123")) // Default password
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhoneNumber())
                .role(Role.valueOf("TEACHER"))
                .schoolId(schoolId)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // Create Teacher
        Teacher teacher = Teacher.builder()
                .user(user)
                .schoolId(schoolId)
                .speciality(request.getSpeciality())
                .hireDate(request.getHireDate())
                .employeeNumber(request.getEmployeeNumber())
                .status("ACTIVE")
                .salary(request.getSalary())
                .build();
        teacher = teacherRepository.save(teacher);

        log.info("Teacher created successfully with ID: {}", teacher.getId());
        return teacherMapper.toDetailDTO(teacher);
    }

    @Override
    @Transactional
    public TeacherDetailDTO update(UUID id, UpdateTeacherRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating teacher: {} for school: {}", id, schoolId);

        Teacher teacher = teacherRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        User user = teacher.getUser();

        // Update user fields
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhone(request.getPhoneNumber());
        }
        userRepository.save(user);

        // Update teacher fields
        if (request.getSpeciality() != null) {
            teacher.setSpeciality(request.getSpeciality());
        }
        if (request.getStatus() != null) {
            teacher.setStatus(request.getStatus());
        }
        if (request.getSalary() != null) {
            teacher.setSalary(request.getSalary());
        }

        teacher = teacherRepository.save(teacher);
        log.info("Teacher updated successfully: {}", id);
        return teacherMapper.toDetailDTO(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDetailDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching teacher: {} for school: {}", id, schoolId);

        Teacher teacher = teacherRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        return teacherMapper.toDetailDTO(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeacherDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all teachers for school: {}", schoolId);

        Page<Teacher> teachers = teacherRepository.findBySchoolId(schoolId, pageable);
        return teachers.map(teacherMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeacherDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching teachers with keyword: {} for school: {}", keyword, schoolId);

        Page<Teacher> teachers = teacherRepository.searchByKeyword(schoolId, keyword, pageable);
        return teachers.map(teacherMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeacherDTO> getByStatus(String status, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching teachers with status: {} for school: {}", status, schoolId);

        Page<Teacher> teachers = teacherRepository.findBySchoolIdAndStatus(schoolId, status, pageable);
        return teachers.map(teacherMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting teacher: {} for school: {}", id, schoolId);

        Teacher teacher = teacherRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        // Set user as inactive instead of deleting
        User user = teacher.getUser();
        user.setEnabled(false);
        userRepository.save(user);

        // Set teacher status as TERMINATED
        teacher.setStatus("TERMINATED");
        teacherRepository.save(teacher);

        log.info("Teacher marked as terminated: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherStatisticsDTO getStatistics() {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching statistics for school: {}", schoolId);

        long totalTeachers = teacherRepository.countBySchoolId(schoolId);
        long activeTeachers = teacherRepository.countBySchoolIdAndStatus(schoolId, "ACTIVE");
        long inactiveTeachers = teacherRepository.countBySchoolIdAndStatus(schoolId, "INACTIVE");
        long onLeaveTeachers = teacherRepository.countBySchoolIdAndStatus(schoolId, "ON_LEAVE");

        // Get teachers by speciality
        List<Teacher> allTeachers = teacherRepository.findBySchoolId(schoolId);
        Map<String, Long> teachersBySpeciality = allTeachers.stream()
                .filter(t -> t.getSpeciality() != null && !t.getSpeciality().isEmpty())
                .collect(Collectors.groupingBy(
                        Teacher::getSpeciality,
                        Collectors.counting()
                ));

        return TeacherStatisticsDTO.builder()
                .totalTeachers(totalTeachers)
                .activeTeachers(activeTeachers)
                .inactiveTeachers(inactiveTeachers)
                .onLeaveTeachers(onLeaveTeachers)
                .teachersBySpeciality(teachersBySpeciality)
                .build();
    }
}
