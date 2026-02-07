package com.school.saas.module.teacher.mapper;

import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.dto.TeacherDTO;
import com.school.saas.module.teacher.dto.TeacherDetailDTO;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {

    public TeacherDTO toDTO(Teacher teacher) {
        if (teacher == null) {
            return null;
        }

        return TeacherDTO.builder()
                .id(teacher.getId())
                .userId(teacher.getUser() != null ? teacher.getUser().getId() : null)
                .firstName(teacher.getUser() != null ? teacher.getUser().getFirstName() : null)
                .lastName(teacher.getUser() != null ? teacher.getUser().getLastName() : null)
                .email(teacher.getUser() != null ? teacher.getUser().getEmail() : null)
                .schoolId(teacher.getSchoolId())
                .speciality(teacher.getSpeciality())
                .hireDate(teacher.getHireDate())
                .employeeNumber(teacher.getEmployeeNumber())
                .status(String.valueOf(teacher.getStatus()))
                .salary(teacher.getSalary())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }

    public TeacherDetailDTO toDetailDTO(Teacher teacher) {
        if (teacher == null) {
            return null;
        }

        return TeacherDetailDTO.builder()
                .id(teacher.getId())
                .userId(teacher.getUser() != null ? teacher.getUser().getId() : null)
                .firstName(teacher.getUser() != null ? teacher.getUser().getFirstName() : null)
                .lastName(teacher.getUser() != null ? teacher.getUser().getLastName() : null)
                .email(teacher.getUser() != null ? teacher.getUser().getEmail() : null)
                .phoneNumber(teacher.getUser() != null ? teacher.getUser().getPhone() : null)
                .schoolId(teacher.getSchoolId())
                .schoolName(teacher.getSchool() != null ? teacher.getSchool().getName() : null)
                .speciality(teacher.getSpeciality())
                .hireDate(teacher.getHireDate())
                .employeeNumber(teacher.getEmployeeNumber())
                .status(String.valueOf(teacher.getStatus()))
                .salary(teacher.getSalary())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }
}
