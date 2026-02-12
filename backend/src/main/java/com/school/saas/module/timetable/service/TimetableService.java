package com.school.saas.module.timetable.service;

import com.school.saas.module.timetable.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

public interface TimetableService {
    TimetableDetailDTO create(CreateTimetableRequest request);

    TimetableDetailDTO update(UUID id, UpdateTimetableRequest request);

    TimetableDetailDTO getById(UUID id);

    Page<TimetableDTO> getAll(Pageable pageable);

    List<TimetableDTO> getByClassRoom(UUID classRoomId);

    List<TimetableDTO> getByTeacher(UUID teacherId);

    List<TimetableDTO> getByCourse(UUID courseId);

    List<TimetableDTO> getBySpeciality(UUID specialityId);

    List<TimetableDTO> getByDayOfWeek(DayOfWeek dayOfWeek);

    Page<TimetableDTO> getByAcademicYear(String academicYear, Pageable pageable);

    Page<TimetableDTO> getBySemester(String semester, Pageable pageable);

    Page<TimetableDTO> searchByKeyword(String keyword, Pageable pageable);

    void delete(UUID id);

    void activate(UUID id);

    void deactivate(UUID id);

    TimetableStatisticsDTO getStatistics();

    byte[] exportTimetableByTeacher(UUID teacherId, String academicYear);

    byte[] exportTimetableByClassRoom(UUID classRoomId, String academicYear);

    byte[] exportTimetableByCourse(UUID courseId, String academicYear);

    byte[] exportTimetableBySpeciality(UUID specialityId, String academicYear);
}
