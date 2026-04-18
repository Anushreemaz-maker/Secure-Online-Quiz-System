package com.quizserver.dto;

import lombok.Data;

@Data
public class Testdto {
    private Long id;          // ← ADD THIS
    private String title;
    private String description;
    private int timeLimit;
}