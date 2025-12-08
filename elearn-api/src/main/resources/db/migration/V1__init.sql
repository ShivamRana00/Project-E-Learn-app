-- Flyway migration: initial schema
CREATE TABLE IF NOT EXISTS courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(2000),
  difficulty VARCHAR(50),
  tags VARCHAR(255),
  enroll_count INT,
  quiz_id VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
