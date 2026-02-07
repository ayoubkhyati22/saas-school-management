package com.school.saas.module.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentStatisticsDTO {
    private long totalStudents;
    private long activeStudents;
    private long inactiveStudents;
    private long maleStudents;
    private long femaleStudents;
    private Map<String, Long> studentsByClass;
    private Map<String, Long> studentsByGender;
}
