package com.school.saas.module.parent.mapper;

import com.school.saas.module.parent.Parent;
import com.school.saas.module.parent.dto.ParentDTO;
import com.school.saas.module.parent.dto.ParentDetailDTO;
import org.springframework.stereotype.Component;

@Component
public class ParentMapper {

    public ParentDTO toDTO(Parent parent) {
        if (parent == null) {
            return null;
        }

        return ParentDTO.builder()
                .id(parent.getId())
                .userId(parent.getUser() != null ? parent.getUser().getId() : null)
                .firstName(parent.getUser() != null ? parent.getUser().getFirstName() : null)
                .lastName(parent.getUser() != null ? parent.getUser().getLastName() : null)
                .email(parent.getUser() != null ? parent.getUser().getEmail() : null)
                .phoneNumber(parent.getUser() != null ? parent.getUser().getPhone() : null)
                .schoolId(parent.getSchoolId())
                .occupation(parent.getOccupation())
                .address(parent.getAddress())
                .createdAt(parent.getCreatedAt())
                .updatedAt(parent.getUpdatedAt())
                .build();
    }

    public ParentDetailDTO toDetailDTO(Parent parent) {
        if (parent == null) {
            return null;
        }

        return ParentDetailDTO.builder()
                .id(parent.getId())
                .userId(parent.getUser() != null ? parent.getUser().getId() : null)
                .firstName(parent.getUser() != null ? parent.getUser().getFirstName() : null)
                .lastName(parent.getUser() != null ? parent.getUser().getLastName() : null)
                .email(parent.getUser() != null ? parent.getUser().getEmail() : null)
                .phoneNumber(parent.getUser() != null ? parent.getUser().getPhone() : null)
                .schoolId(parent.getSchoolId())
                .schoolName(parent.getSchool() != null ? parent.getSchool().getName() : null)
                .occupation(parent.getOccupation())
                .address(parent.getAddress())
                .createdAt(parent.getCreatedAt())
                .updatedAt(parent.getUpdatedAt())
                .build();
    }
}
