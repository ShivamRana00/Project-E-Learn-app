package com.elearn.elearn_api.repository;

import com.elearn.elearn_api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
