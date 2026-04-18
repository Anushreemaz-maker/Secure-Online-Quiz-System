package com.quizserver.Service.user;

import com.quizserver.dto.QuestionDto;

public interface QuestionService {
    QuestionDto addQuestion(QuestionDto questionDto); // ← must match EXACTLY
}