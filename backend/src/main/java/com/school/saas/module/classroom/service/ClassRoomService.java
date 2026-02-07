package com.school.saas.module.classroom.service;

import com.school.saas.module.classroom.dto.*;
import com.school.saas.module.student.dto.StudentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ClassRoomService {
    ClassRoomDetailDTO create(CreateClassRoomRequest request);

    ClassRoomDetailDTO update(UUID id, UpdateClassRoomRequest request);

    ClassRoomDetailDTO getById(UUID id);

    Page<ClassRoomDTO> getAll(Pageable pageable);

    Page<ClassRoomDTO> getByAcademicYear(String academicYear, Pageable pageable);

    Page<ClassRoomDTO> searchByKeyword(String keyword, Pageable pageable);

    void delete(UUID id);

    ClassRoomDetailDTO assignClassTeacher(UUID id, UUID teacherId);

    List<StudentDTO> getStudentsByClassroom(UUID classRoomId);

    ClassRoomStatisticsDTO getClassroomStatistics(UUID classRoomId);
}
