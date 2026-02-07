package com.school.saas.module.parent.mapper;

import com.school.saas.module.parent.ParentStudent;
import com.school.saas.module.parent.dto.ParentStudentDTO;
import org.springframework.stereotype.Component;

@Component
public class ParentStudentMapper {

    public ParentStudentDTO toDTO(ParentStudent parentStudent) {
        if (parentStudent == null) {
            return null;
        }

        return ParentStudentDTO.builder()
                .id(parentStudent.getId())
                .parentId(parentStudent.getParent() != null ? parentStudent.getParent().getId() : null)
                .studentId(parentStudent.getStudent() != null ? parentStudent.getStudent().getId() : null)
                .studentFirstName(parentStudent.getStudent() != null && parentStudent.getStudent().getUser() != null ?
                                 parentStudent.getStudent().getUser().getFirstName() : null)
                .studentLastName(parentStudent.getStudent() != null && parentStudent.getStudent().getUser() != null ?
                                parentStudent.getStudent().getUser().getLastName() : null)
                .studentRegistrationNumber(parentStudent.getStudent() != null ?
                                          parentStudent.getStudent().getRegistrationNumber() : null)
                .classRoomName(parentStudent.getStudent() != null && parentStudent.getStudent().getClassRoom() != null ?
                              parentStudent.getStudent().getClassRoom().getName() : null)
                .isPrimaryContact(parentStudent.getIsPrimaryContact())
                .relationshipType(parentStudent.getRelationshipType())
                .build();
    }
}
