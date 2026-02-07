package com.school.saas.module.teacher.service;

import com.school.saas.module.teacher.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TeacherService {
    TeacherDetailDTO create(CreateTeacherRequest request);

    TeacherDetailDTO update(UUID id, UpdateTeacherRequest request);

    TeacherDetailDTO getById(UUID id);

    Page<TeacherDTO> getAll(Pageable pageable);

    Page<TeacherDTO> searchByKeyword(String keyword, Pageable pageable);

    Page<TeacherDTO> getByStatus(String status, Pageable pageable);

    void delete(UUID id);

    TeacherStatisticsDTO getStatistics();
}
