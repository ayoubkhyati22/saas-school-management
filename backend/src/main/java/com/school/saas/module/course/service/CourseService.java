package com.school.saas.module.course.service;

import com.school.saas.module.course.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    CourseDetailDTO create(CreateCourseRequest request);

    CourseDetailDTO update(UUID id, UpdateCourseRequest request);

    CourseDetailDTO getById(UUID id);

    Page<CourseDTO> getAll(Pageable pageable);

    List<CourseDTO> getByClassroom(UUID classRoomId);

    List<CourseDTO> getByTeacher(UUID teacherId);

    Page<CourseDTO> searchByKeyword(String keyword, Pageable pageable);

    Page<CourseDTO> getBySemester(String semester, Pageable pageable);

    void delete(UUID id);

    CourseMaterialDTO uploadMaterial(UUID courseId, MultipartFile file, UploadMaterialRequest request);

    List<CourseMaterialDTO> getMaterialsByCourse(UUID courseId);

    void deleteMaterial(UUID materialId);
}
