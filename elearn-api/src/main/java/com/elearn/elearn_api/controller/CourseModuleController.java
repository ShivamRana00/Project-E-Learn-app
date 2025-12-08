package com.elearn.elearn_api.controller;

import com.elearn.elearn_api.model.CourseModule;
import com.elearn.elearn_api.repository.CourseModuleRepository;
import com.elearn.elearn_api.repository.CourseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseModuleController {
    private final CourseModuleRepository moduleRepo;
    private final CourseRepository courseRepo;

    public CourseModuleController(CourseModuleRepository moduleRepo, CourseRepository courseRepo) {
        this.moduleRepo = moduleRepo;
        this.courseRepo = courseRepo;
    }

    @GetMapping("/{courseId}/modules")
    public ResponseEntity<List<CourseModule>> getModules(@PathVariable Long courseId) {
        if (!courseRepo.existsById(courseId)) return ResponseEntity.notFound().build();
        List<CourseModule> list = moduleRepo.findByCourse_IdOrderByPositionAsc(courseId);
        return ResponseEntity.ok(list);
    }
}
