package com.school.saas.module.course.mapper;

import com.school.saas.module.course.Course;
import com.school.saas.module.course.dto.CourseDTO;
import com.school.saas.module.course.dto.CourseDetailDTO;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }

        String teacherName = null;
        if (course.getTeacher() != null && course.getTeacher().getUser() != null) {
            teacherName = course.getTeacher().getUser().getFirstName() + " " +
                         course.getTeacher().getUser().getLastName();
        }

        return CourseDTO.builder()
                .id(course.getId())
                .schoolId(course.getSchoolId())
                .classRoomId(course.getClassRoom() != null ? course.getClassRoom().getId() : null)
                .classRoomName(course.getClassRoom() != null ? course.getClassRoom().getName() : null)
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(teacherName)
                .specialityId(course.getSpeciality() != null ? course.getSpeciality().getId() : null)
                .specialityName(course.getSpeciality() != null ? course.getSpeciality().getName() : null)
                .specialityCode(course.getSpeciality() != null ? course.getSpeciality().getCode() : null)
                .subject(course.getSubject())
                .subjectCode(course.getSubjectCode())
                .description(course.getDescription())
                .schedule(course.getSchedule())
                .semester(course.getSemester())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    public CourseDetailDTO toDetailDTO(Course course, long materialCount) {
        if (course == null) {
            return null;
        }

        String teacherName = null;
        String teacherEmail = null;
        if (course.getTeacher() != null && course.getTeacher().getUser() != null) {
            teacherName = course.getTeacher().getUser().getFirstName() + " " +
                         course.getTeacher().getUser().getLastName();
            teacherEmail = course.getTeacher().getUser().getEmail();
        }

        return CourseDetailDTO.builder()
                .id(course.getId())
                .schoolId(course.getSchoolId())
                .classRoomId(course.getClassRoom() != null ? course.getClassRoom().getId() : null)
                .classRoomName(course.getClassRoom() != null ? course.getClassRoom().getName() : null)
                .classRoomLevel(course.getClassRoom() != null ? course.getClassRoom().getLevel() : null)
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(teacherName)
                .teacherEmail(teacherEmail)
                .specialityId(course.getSpeciality() != null ? course.getSpeciality().getId() : null)
                .specialityName(course.getSpeciality() != null ? course.getSpeciality().getName() : null)
                .specialityCode(course.getSpeciality() != null ? course.getSpeciality().getCode() : null)
                .subject(course.getSubject())
                .subjectCode(course.getSubjectCode())
                .description(course.getDescription())
                .schedule(course.getSchedule())
                .semester(course.getSemester())
                .materialCount(materialCount)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
