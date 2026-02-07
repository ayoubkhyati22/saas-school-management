package com.school.saas.module.classroom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassRoomStatisticsDTO {
    private long totalStudents;
    private long maleStudents;
    private long femaleStudents;
    private long activeStudents;
    private Integer capacity;
    private Double occupancyRate;
}
