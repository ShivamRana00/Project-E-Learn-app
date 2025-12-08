-- Seed some initial courses so UI can display items
INSERT INTO courses (title, description, difficulty, tags, enroll_count, quiz_id) VALUES
('Java Foundations', 'Core Java and OOP.', 'Beginner', 'Java,Beginner', 120, 'quiz_c_java'),
('Advanced Java', 'Streams, concurrency, JVM.', 'Intermediate', 'Java,Intermediate', 85, 'quiz_c_java_adv'),
('Data Structures & Algorithms', 'Big-O, arrays to graphs.', 'Intermediate', 'DSA,Java,Intermediate', 200, 'quiz_c_dsa'),
('Frontend with React', 'Hooks, state, components.', 'Intermediate', 'Web Dev,React,Intermediate', 150, 'quiz_c_react'),
('DBMS Essentials', 'Relational model & SQL.', 'Beginner', 'DBMS,SQL,Beginner', 170, 'quiz_c_dbms');
