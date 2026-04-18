package com.quizserver.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OptionDto {
    private Long id;
    private String optionText;

    @JsonProperty("isCorrect")
    private boolean isCorrect;
}