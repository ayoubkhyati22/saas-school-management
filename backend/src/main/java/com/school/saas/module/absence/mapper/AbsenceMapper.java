package com.school.saas.module.absence.mapper;

import com.school.saas.module.absence.dto.AbsenceDTO;
import com.school.saas.module.absence.entity.Absence;
import org.springframework.stereotype.Component;

@Component
public class AbsenceMapper {

    public AbsenceDTO toDTO(Absence absence) {
        if (absence == null) {
            return null;
        }

        return AbsenceDTO.builder()
                .id(absence.getId())
                .schoolId(absence.getSchoolId())
                .studentId(absence.getStudent().getId())
                .studentName(absence.getStudent().getUser().getFirstName() + " " +
                            absence.getStudent().getUser().getLastName())
                .courseId(absence.getCourse().getId())
                .courseSubject(absence.getCourse().getSubject())
                .date(absence.getDate())
                .reason(absence.getReason())
                .justified(absence.getJustified())
                .justificationDocument(absence.getJustificationDocument())
                .reportedBy(absence.getReportedBy())
                .createdAt(absence.getCreatedAt())
                .updatedAt(absence.getUpdatedAt())
                .build();
    }
}
