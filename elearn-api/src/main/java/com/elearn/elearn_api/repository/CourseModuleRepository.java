package com.elearn.elearn_api.repository;

import com.elearn.elearn_api.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
    List<CourseModule> findByCourse_IdOrderByPositionAsc(Long courseId);
}
