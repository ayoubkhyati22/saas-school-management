package com.school.saas.module.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentStudentDTO {
    private UUID id;
    private UUID parentId;
    private UUID studentId;
    private String studentFirstName;
    private String studentLastName;
    private String studentRegistrationNumber;
    private String classRoomName;
    private Boolean isPrimaryContact;
    private String relationshipType;
}
