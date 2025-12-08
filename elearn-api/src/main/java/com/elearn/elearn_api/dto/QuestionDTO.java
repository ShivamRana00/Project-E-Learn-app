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
public class QuestionDTO {
    private Long id;
    private String type; // mcq | tf
    private String question;
    private List<String> options; // for mcq
    private Integer answer; // index for mcq
    private Boolean answerBool; // for tf
    private String difficulty;
}
