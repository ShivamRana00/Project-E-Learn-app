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
@Table(name = "quiz_questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", referencedColumnName = "id", nullable = false)
    private Quiz quiz;

    @Column(name = "q_type", length = 10, nullable = false)
    private String type; // mcq | tf

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "correct_index")
    private Integer correctIndex;

    @Column(name = "correct_bool")
    private Boolean correctBool;

    @Column(length = 16)
    private String difficulty;
}
