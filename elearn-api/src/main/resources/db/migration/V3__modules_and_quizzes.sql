-- Create modules, quizzes, questions tables
CREATE TABLE IF NOT EXISTS course_modules (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  estimated_min INT,
  position INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_module_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(100) PRIMARY KEY,
  course_id BIGINT,
  CONSTRAINT fk_quiz_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quiz_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quiz_id VARCHAR(100) NOT NULL,
  q_type VARCHAR(10) NOT NULL, -- mcq or tf
  question TEXT NOT NULL,
  options_json TEXT NULL,
  correct_index INT NULL,
  correct_bool TINYINT(1) NULL,
  difficulty VARCHAR(16) DEFAULT 'easy',
  CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed modules for a few known courses by title
INSERT INTO course_modules (course_id, title, content, estimated_min, position)
SELECT c.id, CONCAT(c.title, ' - Module 1'), CONCAT(c.title, ' key concepts and examples for module 1.'), 12, 1
FROM courses c WHERE c.title IN ('Java Foundations','Advanced Java','Data Structures & Algorithms','Frontend with React','DBMS Essentials');

INSERT INTO course_modules (course_id, title, content, estimated_min, position)
SELECT c.id, CONCAT(c.title, ' - Module 2'), CONCAT(c.title, ' key concepts and examples for module 2.'), 15, 2
FROM courses c WHERE c.title IN ('Java Foundations','Advanced Java','Data Structures & Algorithms','Frontend with React','DBMS Essentials');

-- Seed quizzes for seeded courses if not exists
INSERT INTO quizzes (id, course_id)
SELECT c.quiz_id, c.id FROM courses c
LEFT JOIN quizzes q ON q.id = c.quiz_id
WHERE q.id IS NULL AND c.quiz_id IS NOT NULL;

-- Seed simple questions (2 per quiz)
INSERT INTO quiz_questions (quiz_id, q_type, question, options_json, correct_index, correct_bool, difficulty)
SELECT c.quiz_id, 'mcq', CONCAT('What is a key topic in ', c.title, '?'), '["A","B","C","D"]', 0, NULL, 'easy'
FROM courses c WHERE c.quiz_id IS NOT NULL;

INSERT INTO quiz_questions (quiz_id, q_type, question, options_json, correct_index, correct_bool, difficulty)
SELECT c.quiz_id, 'tf', CONCAT('Is ', c.title, ' useful?'), NULL, NULL, 1, 'medium'
FROM courses c WHERE c.quiz_id IS NOT NULL;
