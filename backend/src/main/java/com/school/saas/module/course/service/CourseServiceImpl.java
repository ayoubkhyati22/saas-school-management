package com.school.saas.module.course.service;

import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.course.Course;
import com.school.saas.module.course.CourseMaterial;
import com.school.saas.module.course.dto.*;
import com.school.saas.module.course.mapper.CourseMapper;
import com.school.saas.module.course.mapper.CourseMaterialMapper;
import com.school.saas.module.course.repository.CourseMaterialRepository;
import com.school.saas.module.course.repository.CourseRepository;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.speciality.repository.SpecialityRepository;
import com.school.saas.module.subscription.SubscriptionLimitService;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMaterialRepository courseMaterialRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;
    private final SpecialityRepository specialityRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    private final CourseMaterialMapper courseMaterialMapper;
    private final SubscriptionLimitService subscriptionLimitService;

    @Value("${app.upload.dir:uploads/course-materials}")
    private String uploadDir;

    @Override
    @Transactional
    public CourseDetailDTO create(CreateCourseRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating course for school: {}", schoolId);

        // Verify classroom belongs to school
        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(request.getClassRoomId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        // Verify teacher belongs to school
        Teacher teacher = teacherRepository.findByIdAndSchoolId(request.getTeacherId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        // Get speciality if provided
        Speciality speciality = null;
        if (request.getSpecialityId() != null) {
            speciality = specialityRepository.findByIdAndSchoolId(request.getSpecialityId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));
        }

        Course course = Course.builder()
                .schoolId(schoolId)
                .classRoom(classRoom)
                .teacher(teacher)
                .speciality(speciality)
                .subject(request.getSubject())
                .subjectCode(request.getSubjectCode())
                .description(request.getDescription())
                .schedule(request.getSchedule())
                .semester(request.getSemester())
                .build();
        course = courseRepository.save(course);

        log.info("Course created successfully with ID: {}", course.getId());
        return courseMapper.toDetailDTO(course, 0);
    }

    @Override
    @Transactional
    public CourseDetailDTO update(UUID id, UpdateCourseRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating course: {} for school: {}", id, schoolId);

        Course course = courseRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findByIdAndSchoolId(request.getTeacherId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            course.setTeacher(teacher);
        }
        if (request.getSpecialityId() != null) {
            Speciality speciality = specialityRepository.findByIdAndSchoolId(request.getSpecialityId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));
            course.setSpeciality(speciality);
        }
        if (request.getSubject() != null) {
            course.setSubject(request.getSubject());
        }
        if (request.getSubjectCode() != null) {
            course.setSubjectCode(request.getSubjectCode());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getSchedule() != null) {
            course.setSchedule(request.getSchedule());
        }
        if (request.getSemester() != null) {
            course.setSemester(request.getSemester());
        }

        course = courseRepository.save(course);
        long materialCount = courseMaterialRepository.countByCourseId(id);

        log.info("Course updated successfully: {}", id);
        return courseMapper.toDetailDTO(course, materialCount);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching course: {} for school: {}", id, schoolId);

        Course course = courseRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        long materialCount = courseMaterialRepository.countByCourseId(id);
        return courseMapper.toDetailDTO(course, materialCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all courses for school: {}", schoolId);

        Page<Course> courses = courseRepository.findBySchoolId(schoolId, pageable);
        return courses.map(courseMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getByClassroom(UUID classRoomId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching courses for classroom: {} in school: {}", classRoomId, schoolId);

        // Verify classroom belongs to school
        classRoomRepository.findByIdAndSchoolId(classRoomId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        List<Course> courses = courseRepository.findByClassRoomId(classRoomId);
        return courses.stream()
                .map(courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getByTeacher(UUID teacherId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching courses for teacher: {} in school: {}", teacherId, schoolId);

        // Verify teacher belongs to school
        teacherRepository.findByIdAndSchoolId(teacherId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return courses.stream()
                .map(courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching courses with keyword: {} for school: {}", keyword, schoolId);

        Page<Course> courses = courseRepository.searchByKeyword(schoolId, keyword, pageable);
        return courses.map(courseMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseDTO> getBySemester(String semester, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching courses for semester: {} in school: {}", semester, schoolId);

        Page<Course> courses = courseRepository.findBySchoolIdAndSemester(schoolId, semester, pageable);
        return courses.map(courseMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting course: {} for school: {}", id, schoolId);

        Course course = courseRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Delete associated materials
        List<CourseMaterial> materials = courseMaterialRepository.findByCourseId(id);
        for (CourseMaterial material : materials) {
            deleteFile(material.getFilePath());
            courseMaterialRepository.delete(material);
        }

        courseRepository.delete(course);
        log.info("Course deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public CourseMaterialDTO uploadMaterial(UUID courseId, MultipartFile file, UploadMaterialRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Uploading material for course: {} in school: {}", courseId, schoolId);

        // Verify course belongs to school
        Course course = courseRepository.findByIdAndSchoolId(courseId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Validate storage limit
        subscriptionLimitService.validateStorageLimit(schoolId, file.getSize());

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Save file
        String filePath = saveFile(file, schoolId);
        String fileType = determineFileType(file.getContentType());

        CourseMaterial material = CourseMaterial.builder()
                .course(course)
                .schoolId(schoolId)
                .title(request.getTitle())
                .filePath(filePath)
                .fileType(fileType)
                .fileSize(file.getSize())
                .uploadedBy(currentUser.getId())
                .uploadedAt(LocalDateTime.now())
                .build();
        material = courseMaterialRepository.save(material);

        log.info("Material uploaded successfully with ID: {}", material.getId());
        return courseMaterialMapper.toDTO(material, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseMaterialDTO> getMaterialsByCourse(UUID courseId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching materials for course: {} in school: {}", courseId, schoolId);

        // Verify course belongs to school
        courseRepository.findByIdAndSchoolId(courseId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<CourseMaterial> materials = courseMaterialRepository.findByCourseIdAndSchoolId(courseId, schoolId);
        return materials.stream()
                .map(material -> {
                    User uploader = userRepository.findById(material.getUploadedBy()).orElse(null);
                    return courseMaterialMapper.toDTO(material, uploader);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMaterial(UUID materialId) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting material: {} for school: {}", materialId, schoolId);

        CourseMaterial material = courseMaterialRepository.findByIdAndSchoolId(materialId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        // Delete file from storage
        deleteFile(material.getFilePath());

        courseMaterialRepository.delete(material);
        log.info("Material deleted successfully: {}", materialId);
    }

    private String saveFile(MultipartFile file, UUID schoolId) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir, schoolId.toString());
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return schoolId.toString() + "/" + fileName;
        } catch (IOException e) {
            log.error("Failed to save file", e);
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    private void deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir, filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
        }
    }

    private String determineFileType(String contentType) {
        if (contentType == null) {
            return "UNKNOWN";
        }
        if (contentType.contains("pdf")) {
            return "PDF";
        } else if (contentType.contains("word") || contentType.contains("document")) {
            return "DOCX";
        } else if (contentType.contains("video")) {
            return "VIDEO";
        } else if (contentType.contains("image")) {
            return "IMAGE";
        } else if (contentType.contains("powerpoint") || contentType.contains("presentation")) {
            return "PPT";
        }
        return "OTHER";
    }
}
