package com.school.saas.module.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableStatisticsDTO {
    private long totalSlots;
    private long activeSlots;
    private long inactiveSlots;
    private Map<String, Long> slotsByDayOfWeek;
    private Map<String, Long> slotsByClassRoom;
    private Map<String, Long> slotsByTeacher;
    private Map<String, Long> slotsByCourse;
}
