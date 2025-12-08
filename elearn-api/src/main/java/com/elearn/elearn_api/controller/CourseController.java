package com.elearn.elearn_api.controller;

import com.elearn.elearn_api.model.Course;
import com.elearn.elearn_api.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Course> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Course> get(@PathVariable Long id) {
        Course c = service.get(id);
        return c == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(c);
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course c) {
        Course saved = service.create(c);
        return ResponseEntity.created(URI.create("/api/courses/" + saved.getId())).body(saved);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course patch) {
        Course updated = service.update(id, patch);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
