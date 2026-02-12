package com.school.saas.module.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamStatisticsDTO {
    private Long totalExams;
    private Long scheduledExams;
    private Long completedExams;
    private Long inProgressExams;
    private Long cancelledExams;
    private Long postponedExams;
    private Long resultsPublishedExams;
    private Long resultsPendingExams;
}
