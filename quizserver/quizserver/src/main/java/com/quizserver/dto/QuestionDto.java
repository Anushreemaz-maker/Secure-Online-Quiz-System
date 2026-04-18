package com.quizserver.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDto {

    private Long id;
    private String questionText;
    private Long testId;

    private List<OptionDto> options;
}