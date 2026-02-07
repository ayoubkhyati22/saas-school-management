package com.school.saas.module.teacher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherStatisticsDTO {
    private long totalTeachers;
    private long activeTeachers;
    private long inactiveTeachers;
    private long onLeaveTeachers;
    private Map<String, Long> teachersBySpeciality;
}
