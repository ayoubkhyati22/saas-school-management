package com.school.saas.module.classroom.service;

import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.dto.*;
import com.school.saas.module.classroom.mapper.ClassRoomMapper;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.student.dto.StudentDTO;
import com.school.saas.module.student.mapper.StudentMapper;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.subscription.SubscriptionLimitService;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassRoomServiceImpl implements ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final ClassRoomMapper classRoomMapper;
    private final StudentMapper studentMapper;
    private final SubscriptionLimitService subscriptionLimitService;

    @Override
    @Transactional
    public ClassRoomDetailDTO create(CreateClassRoomRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating classroom for school: {}", schoolId);

        // Validate subscription limit
        subscriptionLimitService.validateClassLimit(schoolId);

        // Check if classroom with same name and academic year already exists
        classRoomRepository.findBySchoolIdAndNameAndAcademicYear(schoolId, request.getName(), request.getAcademicYear())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Classroom with same name already exists for this academic year");
                });

        // Validate teacher if provided
        Teacher classTeacher = null;
        if (request.getClassTeacherId() != null) {
            classTeacher = teacherRepository.findByIdAndSchoolId(request.getClassTeacherId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        }

        ClassRoom classRoom = ClassRoom.builder()
                .schoolId(schoolId)
                .name(request.getName())
                .level(request.getLevel())
                .section(request.getSection())
                .academicYear(request.getAcademicYear())
                .capacity(request.getCapacity())
                .classTeacher(classTeacher)
                .build();
        classRoom = classRoomRepository.save(classRoom);

        log.info("Classroom created successfully with ID: {}", classRoom.getId());
        return classRoomMapper.toDetailDTO(classRoom, 0);
    }

    @Override
    @Transactional
    public ClassRoomDetailDTO update(UUID id, UpdateClassRoomRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating classroom: {} for school: {}", id, schoolId);

        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        if (request.getName() != null) {
            classRoom.setName(request.getName());
        }
        if (request.getLevel() != null) {
            classRoom.setLevel(request.getLevel());
        }
        if (request.getSection() != null) {
            classRoom.setSection(request.getSection());
        }
        if (request.getAcademicYear() != null) {
            classRoom.setAcademicYear(request.getAcademicYear());
        }
        if (request.getCapacity() != null) {
            classRoom.setCapacity(request.getCapacity());
        }
        if (request.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findByIdAndSchoolId(request.getClassTeacherId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            classRoom.setClassTeacher(teacher);
        }

        classRoom = classRoomRepository.save(classRoom);
        long studentCount = studentRepository.countByClassRoomId(id);

        log.info("Classroom updated successfully: {}", id);
        return classRoomMapper.toDetailDTO(classRoom, studentCount);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassRoomDetailDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching classroom: {} for school: {}", id, schoolId);

        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        long studentCount = studentRepository.countByClassRoomId(id);
        return classRoomMapper.toDetailDTO(classRoom, studentCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassRoomDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all classrooms for school: {}", schoolId);

        Page<ClassRoom> classRooms = classRoomRepository.findBySchoolId(schoolId, pageable);
        return classRooms.map(classRoomMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassRoomDTO> getByAcademicYear(String academicYear, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching classrooms for academic year: {} in school: {}", academicYear, schoolId);

        Page<ClassRoom> classRooms = classRoomRepository.findBySchoolIdAndAcademicYear(schoolId, academicYear, pageable);
        return classRooms.map(classRoomMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassRoomDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching classrooms with keyword: {} for school: {}", keyword, schoolId);

        Page<ClassRoom> classRooms = classRoomRepository.searchByKeyword(schoolId, keyword, pageable);
        return classRooms.map(classRoomMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting classroom: {} for school: {}", id, schoolId);

        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        // Check if there are students in the classroom
        long studentCount = studentRepository.countByClassRoomId(id);
        if (studentCount > 0) {
            throw new IllegalStateException("Cannot delete classroom with enrolled students");
        }

        classRoomRepository.delete(classRoom);
        log.info("Classroom deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public ClassRoomDetailDTO assignClassTeacher(UUID id, UUID teacherId) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Assigning teacher {} to classroom {} for school: {}", teacherId, id, schoolId);

        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        Teacher teacher = teacherRepository.findByIdAndSchoolId(teacherId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        classRoom.setClassTeacher(teacher);
        classRoom = classRoomRepository.save(classRoom);

        long studentCount = studentRepository.countByClassRoomId(id);
        log.info("Teacher assigned successfully to classroom");
        return classRoomMapper.toDetailDTO(classRoom, studentCount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByClassroom(UUID classRoomId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching students for classroom: {} in school: {}", classRoomId, schoolId);

        // Verify classroom belongs to school
        classRoomRepository.findByIdAndSchoolId(classRoomId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        return studentRepository.findByClassRoomId(classRoomId).stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClassRoomStatisticsDTO getClassroomStatistics(UUID classRoomId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching statistics for classroom: {} in school: {}", classRoomId, schoolId);

        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(classRoomId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        long totalStudents = studentRepository.countByClassRoomId(classRoomId);
        long activeStudents = studentRepository.findByClassRoomId(classRoomId).stream()
                .filter(s -> "ACTIVE".equals(s.getStatus()))
                .count();
        long maleStudents = studentRepository.findByClassRoomId(classRoomId).stream()
                .filter(s -> "MALE".equals(s.getGender()))
                .count();
        long femaleStudents = studentRepository.findByClassRoomId(classRoomId).stream()
                .filter(s -> "FEMALE".equals(s.getGender()))
                .count();

        Double occupancyRate = 0.0;
        if (classRoom.getCapacity() != null && classRoom.getCapacity() > 0) {
            occupancyRate = (totalStudents * 100.0) / classRoom.getCapacity();
        }

        return ClassRoomStatisticsDTO.builder()
                .totalStudents(totalStudents)
                .maleStudents(maleStudents)
                .femaleStudents(femaleStudents)
                .activeStudents(activeStudents)
                .capacity(classRoom.getCapacity())
                .occupancyRate(occupancyRate)
                .build();
    }
}
