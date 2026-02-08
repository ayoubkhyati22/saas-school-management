package com.school.saas.module.student.service;

import com.school.saas.module.student.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface StudentService {
    StudentDetailDTO create(CreateStudentRequest request);

    StudentDetailDTO update(UUID id, UpdateStudentRequest request);

    StudentDetailDTO getById(UUID id);

    Page<StudentDTO> getAll(Pageable pageable);

    List<StudentDTO> findByClassroom(UUID classRoomId);

    Page<StudentDTO> searchByKeyword(String keyword, Pageable pageable);

    void delete(UUID id);

    StudentStatisticsDTO getStatistics();

    long countByClassroom(UUID classRoomId);

    byte[] exportToCSV();
}
