package com.elearn.elearn_api.service;

import com.elearn.elearn_api.model.Course;
import com.elearn.elearn_api.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public List<Course> findAll() { return repo.findAll(); }

    public Course get(Long id) { return repo.findById(id).orElse(null); }

    public Course create(Course c) { return repo.save(c); }

    public Course update(Long id, Course patch) {
        return repo.findById(id).map(existing -> {
            if (patch.getTitle() != null) existing.setTitle(patch.getTitle());
            if (patch.getDescription() != null) existing.setDescription(patch.getDescription());
            if (patch.getDifficulty() != null) existing.setDifficulty(patch.getDifficulty());
            if (patch.getTags() != null) existing.setTags(patch.getTags());
            if (patch.getEnrollCount() != null) existing.setEnrollCount(patch.getEnrollCount());
            if (patch.getQuizId() != null) existing.setQuizId(patch.getQuizId());
            return repo.save(existing);
        }).orElse(null);
    }

    public void delete(Long id) { repo.deleteById(id); }
}
