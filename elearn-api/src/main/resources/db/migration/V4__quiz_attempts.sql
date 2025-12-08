-- Minimal quiz attempts table (no user FK yet)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quiz_id VARCHAR(100) NOT NULL,
  percent INT NOT NULL,
  points_earned INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
