package com.elearn.elearn_api.dto;

import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmitRequest {
    // answers keyed by questionId -> for mcq: number index, for tf: boolean
    private Map<Long, Object> answers;
}
