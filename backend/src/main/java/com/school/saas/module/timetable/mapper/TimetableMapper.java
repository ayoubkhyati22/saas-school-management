package com.school.saas.module.timetable.mapper;

import com.school.saas.module.timetable.Timetable;
import com.school.saas.module.timetable.dto.TimetableDTO;
import com.school.saas.module.timetable.dto.TimetableDetailDTO;
import org.springframework.stereotype.Component;

@Component
public class TimetableMapper {

    public TimetableDTO toDTO(Timetable timetable) {
        if (timetable == null) {
            return null;
        }

        String teacherName = null;
        if (timetable.getTeacher() != null && timetable.getTeacher().getUser() != null) {
            teacherName = timetable.getTeacher().getUser().getFirstName() + " " +
                         timetable.getTeacher().getUser().getLastName();
        }

        return TimetableDTO.builder()
                .id(timetable.getId())
                .schoolId(timetable.getSchoolId())
                .classRoomId(timetable.getClassRoom() != null ? timetable.getClassRoom().getId() : null)
                .classRoomName(timetable.getClassRoom() != null ? timetable.getClassRoom().getName() : null)
                .classRoomLevel(timetable.getClassRoom() != null ? timetable.getClassRoom().getLevel() : null)
                .teacherId(timetable.getTeacher() != null ? timetable.getTeacher().getId() : null)
                .teacherName(teacherName)
                .courseId(timetable.getCourse() != null ? timetable.getCourse().getId() : null)
                .courseName(timetable.getCourse() != null ? timetable.getCourse().getSubject() : null)
                .courseCode(timetable.getCourse() != null ? timetable.getCourse().getSubjectCode() : null)
                .specialityId(timetable.getSpeciality() != null ? timetable.getSpeciality().getId() : null)
                .specialityName(timetable.getSpeciality() != null ? timetable.getSpeciality().getName() : null)
                .specialityCode(timetable.getSpeciality() != null ? timetable.getSpeciality().getCode() : null)
                .dayOfWeek(timetable.getDayOfWeek())
                .startTime(timetable.getStartTime())
                .endTime(timetable.getEndTime())
                .roomNumber(timetable.getRoomNumber())
                .semester(timetable.getSemester())
                .academicYear(timetable.getAcademicYear())
                .notes(timetable.getNotes())
                .active(timetable.getActive())
                .createdAt(timetable.getCreatedAt())
                .updatedAt(timetable.getUpdatedAt())
                .build();
    }

    public TimetableDetailDTO toDetailDTO(Timetable timetable) {
        if (timetable == null) {
            return null;
        }

        String teacherName = null;
        String teacherEmail = null;
        String teacherEmployeeNumber = null;
        if (timetable.getTeacher() != null) {
            teacherEmployeeNumber = timetable.getTeacher().getEmployeeNumber();
            if (timetable.getTeacher().getUser() != null) {
                teacherName = timetable.getTeacher().getUser().getFirstName() + " " +
                             timetable.getTeacher().getUser().getLastName();
                teacherEmail = timetable.getTeacher().getUser().getEmail();
            }
        }

        return TimetableDetailDTO.builder()
                .id(timetable.getId())
                .schoolId(timetable.getSchoolId())
                .schoolName(timetable.getTeacher() != null && timetable.getTeacher().getSchool() != null ? 
                           timetable.getTeacher().getSchool().getName() : null)
                .classRoomId(timetable.getClassRoom() != null ? timetable.getClassRoom().getId() : null)
                .classRoomName(timetable.getClassRoom() != null ? timetable.getClassRoom().getName() : null)
                .classRoomLevel(timetable.getClassRoom() != null ? timetable.getClassRoom().getLevel() : null)
                .classRoomSection(timetable.getClassRoom() != null ? timetable.getClassRoom().getSection() : null)
                .teacherId(timetable.getTeacher() != null ? timetable.getTeacher().getId() : null)
                .teacherName(teacherName)
                .teacherEmail(teacherEmail)
                .teacherEmployeeNumber(teacherEmployeeNumber)
                .courseId(timetable.getCourse() != null ? timetable.getCourse().getId() : null)
                .courseName(timetable.getCourse() != null ? timetable.getCourse().getSubject() : null)
                .courseCode(timetable.getCourse() != null ? timetable.getCourse().getSubjectCode() : null)
                .courseDescription(timetable.getCourse() != null ? timetable.getCourse().getDescription() : null)
                .specialityId(timetable.getSpeciality() != null ? timetable.getSpeciality().getId() : null)
                .specialityName(timetable.getSpeciality() != null ? timetable.getSpeciality().getName() : null)
                .specialityCode(timetable.getSpeciality() != null ? timetable.getSpeciality().getCode() : null)
                .dayOfWeek(timetable.getDayOfWeek())
                .startTime(timetable.getStartTime())
                .endTime(timetable.getEndTime())
                .roomNumber(timetable.getRoomNumber())
                .semester(timetable.getSemester())
                .academicYear(timetable.getAcademicYear())
                .notes(timetable.getNotes())
                .active(timetable.getActive())
                .createdAt(timetable.getCreatedAt())
                .updatedAt(timetable.getUpdatedAt())
                .build();
    }
}
