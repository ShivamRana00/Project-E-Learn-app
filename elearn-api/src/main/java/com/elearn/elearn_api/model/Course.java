package com.elearn.elearn_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 50)
    private String difficulty; // Beginner, Intermediate, etc.

    @Column(length = 255)
    private String tags; // comma-separated tags

    @Column(name = "enroll_count")
    private Integer enrollCount;

    @Column(name = "quiz_id", length = 100)
    private String quizId;
}
