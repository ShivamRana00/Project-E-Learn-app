package com.elearn.elearn_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummary {
    private String email;
    private String name;
    private Integer points;
    private List<String> badges;
    private Integer enrollments;
    private Integer completedModules;
}
