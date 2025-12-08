package com.elearn.elearn_api.controller;

import com.elearn.elearn_api.dto.CompleteModuleRequest;
import com.elearn.elearn_api.dto.EnrollmentRequest;
import com.elearn.elearn_api.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @PostMapping("/enroll")
    public ResponseEntity<Void> enroll(@RequestBody EnrollmentRequest req) {
        boolean ok = service.enroll(req.getEmail(), req.getCourseId());
        return ok ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PostMapping("/unenroll")
    public ResponseEntity<Void> unenroll(@RequestBody EnrollmentRequest req) {
        boolean ok = service.unenroll(req.getEmail(), req.getCourseId());
        return ok ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> complete(@RequestBody CompleteModuleRequest req) {
        Map<String, Object> res = service.completeModule(req.getEmail(), req.getCourseId(), req.getModuleId());
        return ResponseEntity.ok(res);
    }
}
