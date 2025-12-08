package com.elearn.elearn_api.controller;

import com.elearn.elearn_api.dto.QuestionDTO;
import com.elearn.elearn_api.dto.QuizDTO;
import com.elearn.elearn_api.model.Question;
import com.elearn.elearn_api.model.Quiz;
import com.elearn.elearn_api.repository.QuestionRepository;
import com.elearn.elearn_api.repository.QuizRepository;
import com.elearn.elearn_api.dto.QuizSubmitRequest;
import com.elearn.elearn_api.dto.QuizSubmitResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizRepository quizRepo;
    private final QuestionRepository questionRepo;
    private final ObjectMapper objectMapper;

    public QuizController(QuizRepository quizRepo, QuestionRepository questionRepo, ObjectMapper objectMapper) {
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuiz(@PathVariable String quizId) {
        Optional<Quiz> qOpt = quizRepo.findById(quizId);
        if (qOpt.isEmpty()) return ResponseEntity.notFound().build();
        List<Question> qs = questionRepo.findByQuiz_Id(quizId);
        List<QuestionDTO> dtoQs = qs.stream().map(this::toDto).collect(Collectors.toList());
        Quiz quiz = qOpt.get();
        QuizDTO dto = QuizDTO.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse() != null ? quiz.getCourse().getId() : null)
                .questions(dtoQs)
                .build();
        return ResponseEntity.ok(dto);
    }

    private QuestionDTO toDto(Question q) {
        List<String> options;
        try {
            options = q.getOptionsJson() != null ? objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<String>>() {}) : Collections.emptyList();
        } catch (Exception e) {
            options = Collections.emptyList();
        }
        return QuestionDTO.builder()
                .id(q.getId())
                .type(q.getType())
                .question(q.getQuestion())
                .options(options)
                .answer(q.getCorrectIndex())
                .answerBool(q.getCorrectBool())
                .difficulty(q.getDifficulty())
                .build();
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizSubmitResponse> submit(@PathVariable String quizId, @RequestBody QuizSubmitRequest body) {
        Optional<Quiz> quizOpt = quizRepo.findById(quizId);
        if (quizOpt.isEmpty()) return ResponseEntity.notFound().build();
        List<Question> qs = questionRepo.findByQuiz_Id(quizId);
        if (qs.isEmpty()) return ResponseEntity.ok(new QuizSubmitResponse(0, 0));
        int correct = 0;
        for (Question q : qs) {
            Object ans = body.getAnswers() != null ? body.getAnswers().get(q.getId()) : null;
            if (q.getType().equalsIgnoreCase("mcq")) {
                if (ans instanceof Number) {
                    int idx = ((Number) ans).intValue();
                    if (q.getCorrectIndex() != null && q.getCorrectIndex() == idx) correct++;
                }
            } else if (q.getType().equalsIgnoreCase("tf")) {
                if (ans instanceof Boolean) {
                    boolean b = (Boolean) ans;
                    if (q.getCorrectBool() != null && q.getCorrectBool() == b) correct++;
                }
            }
        }
        int percent = Math.round((correct * 100f) / qs.size());
        int points = correct * 10;
        return ResponseEntity.ok(new QuizSubmitResponse(percent, points));
    }
}
