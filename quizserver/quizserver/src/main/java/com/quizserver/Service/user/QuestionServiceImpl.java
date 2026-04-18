package com.quizserver.Service.user;

import com.quizserver.dto.OptionDto;
import com.quizserver.dto.QuestionDto;
import com.quizserver.entities.Option;
import com.quizserver.entities.Question;
import com.quizserver.entities.Test;
import com.quizserver.repository.QuestionRepository;
import com.quizserver.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;  // ← ADD THIS

    @Override
    public QuestionDto addQuestion(QuestionDto questionDto) {

        // 1️⃣ Find the Test by testId
        Test test = testRepository.findById(questionDto.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found with id: " + questionDto.getTestId()));

        // 2️⃣ Build Question entity
        Question question = new Question();
        question.setQuestionText(questionDto.getQuestionText());
        question.setTest(test);  // ← FIXED: link question to test

        // 3️⃣ Build Options and link to question
        List<Option> options = questionDto.getOptions().stream().map(optionDto -> {
            Option option = new Option();
            option.setOptionText(optionDto.getOptionText());
            option.setCorrect(optionDto.isCorrect());
            option.setQuestion(question);  // ← link option back to question
            return option;
        }).collect(Collectors.toList());

        question.setOptions(options);

        // 4️⃣ Save (cascades to options automatically)
        Question saved = questionRepository.save(question);

        // 5️⃣ Return DTO
        return toDto(saved);
    }

    private QuestionDto toDto(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setTestId(question.getTest().getId());  // ← also return testId

        List<OptionDto> optionDtos = question.getOptions().stream().map(option -> {
            OptionDto optionDto = new OptionDto();
            optionDto.setId(option.getId());
            optionDto.setOptionText(option.getOptionText());
            optionDto.setCorrect(option.isCorrect());
            return optionDto;
        }).collect(Collectors.toList());

        dto.setOptions(optionDtos);
        return dto;
    }
}