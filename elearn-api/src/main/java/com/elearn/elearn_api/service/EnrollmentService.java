package com.elearn.elearn_api.service;

import com.elearn.elearn_api.model.*;
import com.elearn.elearn_api.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class EnrollmentService {
    private final AppUserRepository userRepo;
    private final CourseRepository courseRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final ObjectMapper objectMapper;

    public EnrollmentService(AppUserRepository userRepo, CourseRepository courseRepo, EnrollmentRepository enrollmentRepo, ObjectMapper objectMapper) {
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.objectMapper = objectMapper;
    }

    public AppUser getOrCreateUser(String email, String nameFallback) {
        return userRepo.findByEmail(email).orElseGet(() -> {
            AppUser u = AppUser.builder().email(email).name(nameFallback != null ? nameFallback : email).points(0).badgesJson("[]").build();
            return userRepo.save(u);
        });
    }

    @Transactional
    public boolean enroll(String email, Long courseId) {
        AppUser user = getOrCreateUser(email, email);
        Course course = courseRepo.findById(courseId).orElse(null);
        if (course == null) return false;
        Optional<Enrollment> existing = enrollmentRepo.findByUser_IdAndCourse_Id(user.getId(), courseId);
        if (existing.isPresent()) return true;
        Enrollment e = Enrollment.builder()
                .user(user)
                .course(course)
                .completedJson("[]")
                .lastModuleId(null)
                .quizScoresJson("[]")
                .build();
        enrollmentRepo.save(e);
        return true;
    }

    @Transactional
    public boolean unenroll(String email, Long courseId) {
        AppUser user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return false;
        Optional<Enrollment> existing = enrollmentRepo.findByUser_IdAndCourse_Id(user.getId(), courseId);
        existing.ifPresent(enrollmentRepo::delete);
        return true;
    }

    @Transactional
    public Map<String, Object> completeModule(String email, Long courseId, String moduleId) {
        AppUser user = getOrCreateUser(email, email);
        Enrollment enrollment = enrollmentRepo.findByUser_IdAndCourse_Id(user.getId(), courseId).orElse(null);
        if (enrollment == null) {
            // auto-enroll
            enroll(email, courseId);
            enrollment = enrollmentRepo.findByUser_IdAndCourse_Id(user.getId(), courseId).orElse(null);
            if (enrollment == null) throw new RuntimeException("Enroll failed");
        }
        try {
            List<String> completed = objectMapper.readValue(Optional.ofNullable(enrollment.getCompletedJson()).orElse("[]"), new TypeReference<List<String>>(){});
            if (!completed.contains(moduleId)) completed.add(moduleId);
            enrollment.setCompletedJson(objectMapper.writeValueAsString(completed));
            enrollment.setLastModuleId(moduleId);
            enrollmentRepo.save(enrollment);
            // add points
            int pts = Optional.ofNullable(user.getPoints()).orElse(0) + 5;
            user.setPoints(pts);
            userRepo.save(user);
            Map<String, Object> resp = new HashMap<>();
            resp.put("points", pts);
            resp.put("badges", readBadges(user));
            return resp;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    private List<String> readBadges(AppUser u) {
        try {
            return objectMapper.readValue(Optional.ofNullable(u.getBadgesJson()).orElse("[]"), new TypeReference<List<String>>(){});
        } catch (Exception e) { return Collections.emptyList(); }
    }
}
