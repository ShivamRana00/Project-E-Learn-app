package com.elearn.elearn_api.dto;

import lombok.Data;

@Data
public class CompleteModuleRequest {
    private String email;
    private Long courseId;
    private String moduleId;
}
