package com.school.saas.module.speciality.mapper;

import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.speciality.dto.SpecialityDTO;
import org.springframework.stereotype.Component;

@Component
public class SpecialityMapper {

    public SpecialityDTO toDTO(Speciality speciality) {
        if (speciality == null) {
            return null;
        }

        return SpecialityDTO.builder()
                .id(speciality.getId())
                .schoolId(speciality.getSchoolId())
                .name(speciality.getName())
                .code(speciality.getCode())
                .description(speciality.getDescription())
                .active(speciality.getActive())
                .createdAt(speciality.getCreatedAt())
                .updatedAt(speciality.getUpdatedAt())
                .build();
    }
}
