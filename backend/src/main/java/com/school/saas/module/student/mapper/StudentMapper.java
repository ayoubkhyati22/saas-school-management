package com.school.saas.module.student.mapper;

import com.school.saas.module.student.Student;
import com.school.saas.module.student.dto.StudentDTO;
import com.school.saas.module.student.dto.StudentDetailDTO;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentDTO toDTO(Student student) {
        if (student == null) {
            return null;
        }

        return StudentDTO.builder()
                .id(student.getId())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .firstName(student.getUser() != null ? student.getUser().getFirstName() : null)
                .lastName(student.getUser() != null ? student.getUser().getLastName() : null)
                .email(student.getUser() != null ? student.getUser().getEmail() : null)
                .schoolId(student.getSchoolId())
                .classRoomId(student.getClassRoom() != null ? student.getClassRoom().getId() : null)
                .classRoomName(student.getClassRoom() != null ? student.getClassRoom().getName() : null)
                .registrationNumber(student.getRegistrationNumber())
                .birthDate(student.getBirthDate())
                .gender(student.getGender() != null ? student.getGender().name() : null)
                .enrollmentDate(student.getEnrollmentDate())
                .status(student.getStatus() != null ? student.getStatus().name() : null)
                .address(student.getAddress())
                .avatarUrl(student.getAvatarUrl())
                .administrativeDocuments(student.getAdministrativeDocuments())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public StudentDetailDTO toDetailDTO(Student student) {
        if (student == null) {
            return null;
        }

        return StudentDetailDTO.builder()
                .id(student.getId())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .firstName(student.getUser() != null ? student.getUser().getFirstName() : null)
                .lastName(student.getUser() != null ? student.getUser().getLastName() : null)
                .email(student.getUser() != null ? student.getUser().getEmail() : null)
                .phoneNumber(student.getUser() != null ? student.getUser().getPhone() : null)
                .schoolId(student.getSchoolId())
                .schoolName(student.getSchool() != null ? student.getSchool().getName() : null)
                .classRoomId(student.getClassRoom() != null ? student.getClassRoom().getId() : null)
                .classRoomName(student.getClassRoom() != null ? student.getClassRoom().getName() : null)
                .classRoomLevel(student.getClassRoom() != null ? student.getClassRoom().getLevel() : null)
                .classRoomSection(student.getClassRoom() != null ? student.getClassRoom().getSection() : null)
                .registrationNumber(student.getRegistrationNumber())
                .birthDate(student.getBirthDate())
                .gender(student.getGender() != null ? student.getGender().name() : null)
                .enrollmentDate(student.getEnrollmentDate())
                .status(student.getStatus() != null ? student.getStatus().name() : null)
                .address(student.getAddress())
                .avatarUrl(student.getAvatarUrl())
                .administrativeDocuments(student.getAdministrativeDocuments())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}