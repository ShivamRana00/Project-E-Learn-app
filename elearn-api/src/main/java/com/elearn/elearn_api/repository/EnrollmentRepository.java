package com.elearn.elearn_api.repository;

import com.elearn.elearn_api.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUser_IdAndCourse_Id(Long userId, Long courseId);
    List<Enrollment> findByUser_Id(Long userId);
}
