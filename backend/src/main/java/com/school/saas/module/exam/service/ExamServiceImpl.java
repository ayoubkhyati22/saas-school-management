package com.school.saas.module.exam.service;

import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.course.Course;
import com.school.saas.module.course.repository.CourseRepository;
import com.school.saas.module.exam.*;
import com.school.saas.module.exam.dto.*;
import com.school.saas.module.exam.mapper.ExamMapper;
import com.school.saas.module.exam.repository.ExamRepository;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.speciality.repository.SpecialityRepository;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.security.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final ClassRoomRepository classRoomRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final SpecialityRepository specialityRepository;
    private final ExamMapper examMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ExamDTO> getAllExams(Pageable pageable) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolId(UUID.fromString(schoolId), pageable)
                .map(examMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamDTO getExamById(UUID id) {
        String schoolId = String.valueOf(String.valueOf(TenantContext.getTenantId()));
        Exam exam = examRepository.findByIdAndSchoolId(id, UUID.fromString(schoolId))
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return examMapper.toDTO(exam);
    }

    @Override
    @Transactional
    public ExamDTO createExam(CreateExamRequest request) {
        UUID schoolId = UUID.fromString(String.valueOf(String.valueOf(TenantContext.getTenantId())));

        // Validate classroom
        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(UUID.fromString(request.getClassRoomId()), schoolId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        // Validate course
        Course course = courseRepository.findByIdAndSchoolId(UUID.fromString(request.getCourseId()), schoolId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Validate teacher
        Teacher teacher = teacherRepository.findByIdAndSchoolId(UUID.fromString(request.getTeacherId()), schoolId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Validate speciality if provided
        Speciality speciality = null;
        if (request.getSpecialityId() != null) {
            speciality = specialityRepository.findByIdAndSchoolId(UUID.fromString(request.getSpecialityId()), schoolId)
                    .orElseThrow(() -> new RuntimeException("Speciality not found"));
        }

        // Validate passing marks
        if (request.getPassingMarks() > request.getMaxMarks()) {
            throw new RuntimeException("Passing marks cannot exceed maximum marks");
        }

        Exam exam = Exam.builder()
                .schoolId(UUID.fromString(String.valueOf(schoolId)))
                .classRoom(classRoom)
                .course(course)
                .teacher(teacher)
                .speciality(speciality)
                .title(request.getTitle())
                .description(request.getDescription())
                .examType(request.getExamType())
                .examDate(request.getExamDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .durationMinutes(request.getDurationMinutes())
                .roomNumber(request.getRoomNumber())
                .maxMarks(request.getMaxMarks())
                .passingMarks(request.getPassingMarks())
                .semester(request.getSemester())
                .academicYear(request.getAcademicYear())
                .status(ExamStatus.SCHEDULED)
                .instructions(request.getInstructions())
                .allowCalculators(request.getAllowCalculators() != null ? request.getAllowCalculators() : false)
                .allowBooks(request.getAllowBooks() != null ? request.getAllowBooks() : false)
                .notes(request.getNotes())
                .resultsPublished(false)
                .build();

        Exam savedExam = examRepository.save(exam);
        log.info("Created exam: {} for school: {}", savedExam.getId(), schoolId);
        return examMapper.toDTO(savedExam);
    }

    @Override
    @Transactional
    public ExamDTO updateExam(UUID id, UpdateExamRequest request) {
        UUID schoolId = UUID.fromString(String.valueOf(String.valueOf(TenantContext.getTenantId())));
        Exam exam = examRepository.findByIdAndSchoolId(id, UUID.fromString(String.valueOf(schoolId)))
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findByIdAndSchoolId(UUID.fromString(request.getTeacherId()), schoolId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            exam.setTeacher(teacher);
        }

        if (request.getSpecialityId() != null) {
            Speciality speciality = specialityRepository.findByIdAndSchoolId(UUID.fromString(request.getSpecialityId()), schoolId)
                    .orElseThrow(() -> new RuntimeException("Speciality not found"));
            exam.setSpeciality(speciality);
        }

        if (request.getTitle() != null) exam.setTitle(request.getTitle());
        if (request.getDescription() != null) exam.setDescription(request.getDescription());
        if (request.getExamType() != null) exam.setExamType(request.getExamType());
        if (request.getExamDate() != null) exam.setExamDate(request.getExamDate());
        if (request.getStartTime() != null) exam.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) exam.setEndTime(request.getEndTime());
        if (request.getDurationMinutes() != null) exam.setDurationMinutes(request.getDurationMinutes());
        if (request.getRoomNumber() != null) exam.setRoomNumber(request.getRoomNumber());
        if (request.getMaxMarks() != null) exam.setMaxMarks(request.getMaxMarks());
        if (request.getPassingMarks() != null) exam.setPassingMarks(request.getPassingMarks());
        if (request.getSemester() != null) exam.setSemester(request.getSemester());
        if (request.getAcademicYear() != null) exam.setAcademicYear(request.getAcademicYear());
        if (request.getStatus() != null) exam.setStatus(request.getStatus());
        if (request.getInstructions() != null) exam.setInstructions(request.getInstructions());
        if (request.getAllowCalculators() != null) exam.setAllowCalculators(request.getAllowCalculators());
        if (request.getAllowBooks() != null) exam.setAllowBooks(request.getAllowBooks());
        if (request.getNotes() != null) exam.setNotes(request.getNotes());

        Exam updatedExam = examRepository.save(exam);
        log.info("Updated exam: {} for school: {}", id, schoolId);
        return examMapper.toDTO(updatedExam);
    }

    @Override
    @Transactional
    public void deleteExam(UUID id) {
        String schoolId = String.valueOf(String.valueOf(TenantContext.getTenantId()));
        Exam exam = examRepository.findByIdAndSchoolId(id, UUID.fromString(schoolId))
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        examRepository.delete(exam);
        log.info("Deleted exam: {} for school: {}", id, schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsByClassroom(String classRoomId) {
        UUID schoolId = UUID.fromString(String.valueOf(String.valueOf(TenantContext.getTenantId())));
        return examRepository.findBySchoolIdAndClassRoomId(schoolId, UUID.fromString(classRoomId))
                .stream()
                .map(examMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsByCourse(String courseId) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        return examRepository.findBySchoolIdAndCourseId(schoolId, UUID.fromString(courseId))
                .stream()
                .map(examMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsByTeacher(String teacherId) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolIdAndTeacherId(UUID.fromString(schoolId), UUID.fromString(teacherId))
                .stream()
                .map(examMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsBySpeciality(String specialityId) {
        UUID schoolId = UUID.fromString(String.valueOf(TenantContext.getTenantId()));
        return examRepository.findBySchoolIdAndSpecialityId(schoolId, UUID.fromString(specialityId))
                .stream()
                .map(examMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamDTO> getExamsByType(ExamType examType, Pageable pageable) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolIdAndExamType(UUID.fromString(schoolId), examType, pageable)
                .map(examMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamDTO> getExamsByStatus(ExamStatus status, Pageable pageable) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolIdAndStatus(UUID.fromString(schoolId), status, pageable)
                .map(examMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamDTO> getExamsByAcademicYear(String academicYear, Pageable pageable) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolIdAndAcademicYear(UUID.fromString(schoolId), academicYear, pageable)
                .map(examMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamDTO> getExamsBySemester(String semester, Pageable pageable) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolIdAndSemester(UUID.fromString(schoolId), semester, pageable)
                .map(examMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsByDateRange(LocalDate startDate, LocalDate endDate) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.findBySchoolIdAndExamDateBetween(UUID.fromString(schoolId), startDate, endDate)
                .stream()
                .map(examMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamDTO> searchExams(String keyword, Pageable pageable) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        return examRepository.searchByKeyword(UUID.fromString(schoolId), keyword, pageable)
                .map(examMapper::toDTO);
    }

    @Override
    @Transactional
    public ExamDTO publishResults(UUID id) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        Exam exam = examRepository.findByIdAndSchoolId(id, UUID.fromString(schoolId))
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        exam.setResultsPublished(true);
        exam.setResultsPublishedAt(LocalDateTime.now());
        
        Exam updatedExam = examRepository.save(exam);
        log.info("Published results for exam: {} in school: {}", id, schoolId);
        return examMapper.toDTO(updatedExam);
    }

    @Override
    @Transactional
    public ExamDTO unpublishResults(UUID id) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        Exam exam = examRepository.findByIdAndSchoolId(id, UUID.fromString(schoolId))
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        exam.setResultsPublished(false);
        exam.setResultsPublishedAt(null);
        
        Exam updatedExam = examRepository.save(exam);
        log.info("Unpublished results for exam: {} in school: {}", id, schoolId);
        return examMapper.toDTO(updatedExam);
    }

    @Override
    @Transactional
    public ExamDTO updateExamStatus(UUID id, ExamStatus status) {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        Exam exam = examRepository.findByIdAndSchoolId(id, UUID.fromString(schoolId))
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        exam.setStatus(status);
        
        Exam updatedExam = examRepository.save(exam);
        log.info("Updated status to {} for exam: {} in school: {}", status, id, schoolId);
        return examMapper.toDTO(updatedExam);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamStatisticsDTO getExamStatistics() {
        String schoolId = String.valueOf(TenantContext.getTenantId());
        
        long totalExams = examRepository.countBySchoolId(UUID.fromString(schoolId));
        long scheduledExams = examRepository.countBySchoolIdAndStatus(UUID.fromString(schoolId), ExamStatus.SCHEDULED);
        long completedExams = examRepository.countBySchoolIdAndStatus(UUID.fromString(schoolId), ExamStatus.COMPLETED);
        long inProgressExams = examRepository.countBySchoolIdAndStatus(UUID.fromString(schoolId), ExamStatus.IN_PROGRESS);
        long cancelledExams = examRepository.countBySchoolIdAndStatus(UUID.fromString(schoolId), ExamStatus.CANCELLED);
        long postponedExams = examRepository.countBySchoolIdAndStatus(UUID.fromString(schoolId), ExamStatus.POSTPONED);
        
        List<Exam> publishedExams = examRepository.findBySchoolIdAndResultsPublished(UUID.fromString(schoolId), true);
        long resultsPublishedExams = publishedExams.size();
        long resultsPendingExams = totalExams - resultsPublishedExams;
        
        return ExamStatisticsDTO.builder()
                .totalExams(totalExams)
                .scheduledExams(scheduledExams)
                .completedExams(completedExams)
                .inProgressExams(inProgressExams)
                .cancelledExams(cancelledExams)
                .postponedExams(postponedExams)
                .resultsPublishedExams(resultsPublishedExams)
                .resultsPendingExams(resultsPendingExams)
                .build();
    }
}
