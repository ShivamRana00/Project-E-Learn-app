package com.elearn.elearn_api.controller;

import com.elearn.elearn_api.dto.UserSummary;
import com.elearn.elearn_api.model.AppUser;
import com.elearn.elearn_api.model.Enrollment;
import com.elearn.elearn_api.repository.AppUserRepository;
import com.elearn.elearn_api.repository.EnrollmentRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final AppUserRepository userRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final ObjectMapper objectMapper;

    public UserController(AppUserRepository userRepo, EnrollmentRepository enrollmentRepo, ObjectMapper objectMapper) {
        this.userRepo = userRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/{email}/summary")
    public ResponseEntity<UserSummary> getSummary(@PathVariable String email) {
        Optional<AppUser> uOpt = userRepo.findByEmail(email);
        if (uOpt.isEmpty()) return ResponseEntity.notFound().build();
        AppUser u = uOpt.get();
        List<Enrollment> ens = enrollmentRepo.findByUser_Id(u.getId());
        int completedModules = ens.stream().mapToInt(e -> {
            try {
                List<String> list = objectMapper.readValue(Optional.ofNullable(e.getCompletedJson()).orElse("[]"), new TypeReference<List<String>>(){});
                return list.size();
            } catch (Exception ex) { return 0; }
        }).sum();
        List<String> badges;
        try {
            badges = objectMapper.readValue(Optional.ofNullable(u.getBadgesJson()).orElse("[]"), new TypeReference<List<String>>(){});
        } catch (Exception ex) { badges = Collections.emptyList(); }
        UserSummary dto = UserSummary.builder()
                .email(u.getEmail())
                .name(u.getName())
                .points(Optional.ofNullable(u.getPoints()).orElse(0))
                .badges(badges)
                .enrollments(ens.size())
                .completedModules(completedModules)
                .build();
        return ResponseEntity.ok(dto);
    }
}
