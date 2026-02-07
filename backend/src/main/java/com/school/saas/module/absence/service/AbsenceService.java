package com.school.saas.module.absence.service;

import com.school.saas.module.absence.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AbsenceService {

    AbsenceDTO markAbsence(CreateAbsenceRequest request);

    AbsenceDTO updateAbsence(UUID id, UpdateAbsenceRequest request);

    AbsenceDTO justifyAbsence(UUID id, JustifyAbsenceRequest request);

    void deleteAbsence(UUID id);

    AbsenceDTO getAbsenceById(UUID id);

    List<AbsenceDTO> getAbsencesByStudent(UUID studentId);

    List<AbsenceDTO> getAbsencesByStudentAndCourse(UUID studentId, UUID courseId);

    Page<AbsenceDTO> getAllAbsences(Pageable pageable);

    AbsenceStatisticsDTO getAbsenceStatistics(UUID studentId, LocalDate startDate, LocalDate endDate);

    List<AbsenceDTO> getAbsencesByDateRange(LocalDate startDate, LocalDate endDate);
}
