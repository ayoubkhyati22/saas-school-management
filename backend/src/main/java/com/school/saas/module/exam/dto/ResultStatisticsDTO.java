package com.school.saas.module.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultStatisticsDTO {
    private Long totalResults;
    private Long passCount;
    private Long failCount;
    private Long absentCount;
    private Long pendingCount;
    private Double averagePercentage;
    private Double highestMarks;
    private Double lowestMarks;
}
