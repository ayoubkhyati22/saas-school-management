package com.school.saas.module.parent.service;

import com.school.saas.common.Role;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.parent.Parent;
import com.school.saas.module.parent.ParentStudent;
import com.school.saas.module.parent.dto.*;
import com.school.saas.module.parent.mapper.ParentMapper;
import com.school.saas.module.parent.mapper.ParentStudentMapper;
import com.school.saas.module.parent.repository.ParentRepository;
import com.school.saas.module.parent.repository.ParentStudentRepository;
import com.school.saas.module.student.Student;
import com.school.saas.module.student.repository.StudentRepository;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ParentMapper parentMapper;
    private final ParentStudentMapper parentStudentMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public ParentDetailDTO create(CreateParentRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating parent for school: {}", schoolId);

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create User account
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode("Parent@123")) // Default password
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhoneNumber())
                .role(Role.valueOf("PARENT"))
                .schoolId(schoolId)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // Create Parent
        Parent parent = Parent.builder()
                .user(user)
                .schoolId(schoolId)
                .occupation(request.getOccupation())
                .address(request.getAddress())
                .build();
        parent = parentRepository.save(parent);

        // Link students if provided
        if (request.getStudents() != null && !request.getStudents().isEmpty()) {
            for (LinkStudentRequest studentRequest : request.getStudents()) {
                linkStudentInternal(parent, studentRequest);
            }
        }

        log.info("Parent created successfully with ID: {}", parent.getId());

        ParentDetailDTO detailDTO = parentMapper.toDetailDTO(parent);
        detailDTO.setChildren(getChildren(parent.getId()));
        return detailDTO;
    }

    @Override
    @Transactional
    public ParentDetailDTO update(UUID id, UpdateParentRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating parent: {} for school: {}", id, schoolId);

        Parent parent = parentRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        User user = parent.getUser();

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

        // Update parent fields
        if (request.getOccupation() != null) {
            parent.setOccupation(request.getOccupation());
        }
        if (request.getAddress() != null) {
            parent.setAddress(request.getAddress());
        }

        parent = parentRepository.save(parent);
        log.info("Parent updated successfully: {}", id);

        ParentDetailDTO detailDTO = parentMapper.toDetailDTO(parent);
        detailDTO.setChildren(getChildren(parent.getId()));
        return detailDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public ParentDetailDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching parent: {} for school: {}", id, schoolId);

        Parent parent = parentRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        ParentDetailDTO detailDTO = parentMapper.toDetailDTO(parent);
        detailDTO.setChildren(getChildren(parent.getId()));
        return detailDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ParentDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all parents for school: {}", schoolId);

        Page<Parent> parents = parentRepository.findBySchoolId(schoolId, pageable);
        return parents.map(parentMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ParentDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching parents with keyword: {} for school: {}", keyword, schoolId);

        Page<Parent> parents = parentRepository.searchByKeyword(schoolId, keyword, pageable);
        return parents.map(parentMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting parent: {} for school: {}", id, schoolId);

        Parent parent = parentRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        // Set user as inactive instead of deleting
        User user = parent.getUser();
        user.setEnabled(false);
        userRepository.save(user);

        log.info("Parent marked as inactive: {}", id);
    }

    @Override
    @Transactional
    public ParentStudentDTO linkStudent(UUID parentId, LinkStudentRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Linking student {} to parent {} for school: {}", request.getStudentId(), parentId, schoolId);

        Parent parent = parentRepository.findByIdAndSchoolId(parentId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        return linkStudentInternal(parent, request);
    }

    private ParentStudentDTO linkStudentInternal(Parent parent, LinkStudentRequest request) {
        UUID schoolId = parent.getSchoolId();

        Student student = studentRepository.findByIdAndSchoolId(request.getStudentId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Check if already linked
        if (parentStudentRepository.existsByParentIdAndStudentId(parent.getId(), student.getId())) {
            throw new IllegalArgumentException("Parent and student are already linked");
        }

        ParentStudent parentStudent = ParentStudent.builder()
                .parent(parent)
                .student(student)
                .isPrimaryContact(request.getIsPrimaryContact())
                .relationshipType(request.getRelationshipType())
                .build();
        parentStudent = parentStudentRepository.save(parentStudent);

        log.info("Student linked successfully to parent");
        return parentStudentMapper.toDTO(parentStudent);
    }

    @Override
    @Transactional
    public void unlinkStudent(UUID parentId, UUID studentId) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Unlinking student {} from parent {} for school: {}", studentId, parentId, schoolId);

        // Verify parent belongs to school
        parentRepository.findByIdAndSchoolId(parentId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        // Verify student belongs to school
        studentRepository.findByIdAndSchoolId(studentId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        parentStudentRepository.deleteByParentIdAndStudentId(parentId, studentId);
        log.info("Student unlinked successfully from parent");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParentStudentDTO> getChildren(UUID parentId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching children for parent: {} in school: {}", parentId, schoolId);

        // Verify parent belongs to school
        parentRepository.findByIdAndSchoolId(parentId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        List<ParentStudent> parentStudents = parentStudentRepository.findByParentIdAndSchoolId(parentId, schoolId);
        return parentStudents.stream()
                .map(parentStudentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParentDTO> getParentsByStudent(UUID studentId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching parents for student: {} in school: {}", studentId, schoolId);

        // Verify student belongs to school
        studentRepository.findByIdAndSchoolId(studentId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<ParentStudent> parentStudents = parentStudentRepository.findByStudentIdAndSchoolId(studentId, schoolId);
        return parentStudents.stream()
                .map(ps -> parentMapper.toDTO(ps.getParent()))
                .collect(Collectors.toList());
    }
}
