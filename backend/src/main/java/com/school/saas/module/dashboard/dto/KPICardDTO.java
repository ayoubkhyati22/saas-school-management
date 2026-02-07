package com.school.saas.module.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KPICardDTO {

    private String title;
    private String value; // Can be number, percentage, or currency
    private String trend; // UP, DOWN, NEUTRAL
    private String icon;
    private String color; // success, warning, danger, info
}
