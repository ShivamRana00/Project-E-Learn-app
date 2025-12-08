package com.elearn.elearn_api.repository;

import com.elearn.elearn_api.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuiz_Id(String quizId);
}
