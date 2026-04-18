package com.quizserver.dto;

import lombok.Data;

@Data
public class TestResultDto {
    private Long id;
    private int score;
    private Long userId;
    private Long testId;
}