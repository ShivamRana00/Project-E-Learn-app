package com.elearn.elearn_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizSubmitResponse {
    private int percent;
    private int pointsEarned;
}
