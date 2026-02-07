package com.school.saas.module.classroom.mapper;

import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.dto.ClassRoomDTO;
import com.school.saas.module.classroom.dto.ClassRoomDetailDTO;
import org.springframework.stereotype.Component;

@Component
public class ClassRoomMapper {

    public ClassRoomDTO toDTO(ClassRoom classRoom) {
        if (classRoom == null) {
            return null;
        }

        String classTeacherName = null;
        if (classRoom.getClassTeacher() != null && classRoom.getClassTeacher().getUser() != null) {
            classTeacherName = classRoom.getClassTeacher().getUser().getFirstName() + " " +
                              classRoom.getClassTeacher().getUser().getLastName();
        }

        return ClassRoomDTO.builder()
                .id(classRoom.getId())
                .schoolId(classRoom.getSchoolId())
                .name(classRoom.getName())
                .level(classRoom.getLevel())
                .section(classRoom.getSection())
                .academicYear(classRoom.getAcademicYear())
                .capacity(classRoom.getCapacity())
                .classTeacherId(classRoom.getClassTeacher() != null ? classRoom.getClassTeacher().getId() : null)
                .classTeacherName(classTeacherName)
                .createdAt(classRoom.getCreatedAt())
                .updatedAt(classRoom.getUpdatedAt())
                .build();
    }

    public ClassRoomDetailDTO toDetailDTO(ClassRoom classRoom, long studentCount) {
        if (classRoom == null) {
            return null;
        }

        String classTeacherName = null;
        String classTeacherEmail = null;
        if (classRoom.getClassTeacher() != null && classRoom.getClassTeacher().getUser() != null) {
            classTeacherName = classRoom.getClassTeacher().getUser().getFirstName() + " " +
                              classRoom.getClassTeacher().getUser().getLastName();
            classTeacherEmail = classRoom.getClassTeacher().getUser().getEmail();
        }

        return ClassRoomDetailDTO.builder()
                .id(classRoom.getId())
                .schoolId(classRoom.getSchoolId())
                .name(classRoom.getName())
                .level(classRoom.getLevel())
                .section(classRoom.getSection())
                .academicYear(classRoom.getAcademicYear())
                .capacity(classRoom.getCapacity())
                .classTeacherId(classRoom.getClassTeacher() != null ? classRoom.getClassTeacher().getId() : null)
                .classTeacherName(classTeacherName)
                .classTeacherEmail(classTeacherEmail)
                .studentCount(studentCount)
                .createdAt(classRoom.getCreatedAt())
                .updatedAt(classRoom.getUpdatedAt())
                .build();
    }
}
