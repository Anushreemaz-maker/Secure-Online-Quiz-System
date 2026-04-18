package com.quizserver.controller;

import com.quizserver.Service.user.QuestionService;
import com.quizserver.Service.user.TestService;
import com.quizserver.dto.QuestionDto;
import com.quizserver.dto.Testdto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/questions")
@CrossOrigin
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public QuestionDto addQuestion(@RequestBody QuestionDto dto) {
//         ^^^^^^^^^^^ FIXED - now matches what service returns
        return questionService.addQuestion(dto);
    }

}