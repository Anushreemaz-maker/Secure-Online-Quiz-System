package com.quizserver.entities;

import jakarta.persistence.*;
import lombok.Data;

import com.quizserver.entities.Option;
import java.util.List;

@Entity
@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    // 🔗 MANY questions → ONE test
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    // 🔗 ONE question → MANY options
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options;
}