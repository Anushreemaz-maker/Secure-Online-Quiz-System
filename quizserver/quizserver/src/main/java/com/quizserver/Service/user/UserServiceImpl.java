package com.quizserver.Service.user;

import com.quizserver.dto.OptionDto;
import com.quizserver.dto.QuestionDto;
import com.quizserver.dto.TestResultDto;
import com.quizserver.dto.Testdto;
import com.quizserver.entities.Option;
import com.quizserver.entities.TestResult;
import com.quizserver.entities.User;
import com.quizserver.enums.UserRole;
import com.quizserver.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    // CHECK USER
    public Boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email) != null;
    }

    // REGISTER
    public User createUser(User user) {
        if (user.getRole() == null) {
            user.setRole(UserRole.USER);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // LOGIN
    public User login(User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());

        if (optionalUser.isPresent()) {
            User dbUser = optionalUser.get();

            if (passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                return dbUser;
            }
        }

        throw new RuntimeException("Invalid email or password");
    }

    // GET TESTS
    public List<Testdto> getAllTests() {
        return testRepository.findAll().stream().map(test -> {
            Testdto dto = new Testdto();
            dto.setId(test.getId());
            dto.setTitle(test.getTitle());
            dto.setDescription(test.getDescription());
            dto.setTimeLimit(test.getTimeLimit());
            return dto;
        }).toList();
    }

    // GET QUESTIONS
    public List<QuestionDto> getQuestionsByTestId(Long testId) {
        return questionRepository.findByTestId(testId).stream().map(question -> {

            QuestionDto dto = new QuestionDto();
            dto.setId(question.getId());
            dto.setQuestionText(question.getQuestionText());
            dto.setTestId(testId);

            List<OptionDto> optionDtos = question.getOptions().stream().map(option -> {
                OptionDto optionDto = new OptionDto();
                optionDto.setId(option.getId());
                optionDto.setOptionText(option.getOptionText());
                return optionDto;
            }).toList();

            dto.setOptions(optionDtos);
            return dto;

        }).toList();
    }

    // SCORE
    public int calculateScore(Map<Long, Long> answers) {
        int score = 0;

        for (Map.Entry<Long, Long> entry : answers.entrySet()) {
            Long selectedOptionId = entry.getValue();

            Optional<Option> option = optionRepository.findById(selectedOptionId);

            if (option.isPresent() && option.get().isCorrect()) {
                score++;
            }
        }

        return score;
    }

    // SAVE RESULT (FIXED - NO CRASH)
    public TestResultDto saveResult(Long userId, Long testId, int score) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.quizserver.entities.Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        // 🔥 CHECK IF ALREADY EXISTS
        Optional<TestResult> existingResult =
                testResultRepository.findByUserAndTest(user, test);

        TestResult result;

        if (existingResult.isPresent()) {
            // ✅ DO NOT CRASH — just return existing result
            result = existingResult.get();
        } else {
            // save new result
            result = new TestResult();
            result.setUser(user);
            result.setTest(test);
            result.setScore(score);

            result = testResultRepository.save(result);
        }

        // DTO
        TestResultDto dto = new TestResultDto();
        dto.setId(result.getId());
        dto.setScore(result.getScore());
        dto.setUserId(userId);
        dto.setTestId(testId);

        return dto;
    }
}