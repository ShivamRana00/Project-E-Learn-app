-- Users and Enrollments for progress tracking
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  badges_json TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS enrollments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  completed_json TEXT NULL,
  last_module_id VARCHAR(100) NULL,
  quiz_scores_json TEXT NULL,
  CONSTRAINT fk_enr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_enr_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_course UNIQUE (user_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed two demo users
INSERT INTO users (email, name, points, badges_json)
VALUES ('admin@demo.com','Admin',520,'["First Quiz","High Scorer"]'),
       ('aman@demo.com','Aman',240,'["Course Starter"]')
ON DUPLICATE KEY UPDATE name=VALUES(name);
