package com.elearn.elearn_api.repository;

import com.elearn.elearn_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, String> {
}
