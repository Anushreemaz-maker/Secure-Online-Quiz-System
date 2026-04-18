package com.quizserver.Service.user;

import com.quizserver.dto.QuestionDto;
import com.quizserver.dto.TestResultDto;
import com.quizserver.entities.User;
import com.quizserver.dto.Testdto;


import java.util.List;
import java.util.Map;

public interface UserService {
    User createUser(User user);
    Boolean hasUserWithEmail(String email);
    User login(User user);
    List<Testdto> getAllTests();
    List<QuestionDto> getQuestionsByTestId(Long testId);
    int calculateScore(Map<Long, Long> answers);
    TestResultDto saveResult(Long userId, Long testId, int score);
}
