package com.elearn.elearn_api.dto;

import lombok.Data;

@Data
public class EnrollmentRequest {
    private String email;
    private Long courseId;
}
