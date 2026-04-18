package com.quizserver.controller;

import com.quizserver.Service.user.TestService;
import com.quizserver.Service.user.UserService;
import com.quizserver.dto.QuestionDto;
import com.quizserver.dto.TestResultDto;
import com.quizserver.dto.Testdto;
import com.quizserver.entities.User;
import com.quizserver.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ ADDED: inject TestService to fetch single test
    @Autowired
    private TestService testService;

    @Autowired
    private TestResultRepository testResultRepository;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signupUser(@RequestBody User user) {
        if (userService.hasUserWithEmail(user.getEmail())) {
            return new ResponseEntity<>("User already exists", HttpStatus.NOT_ACCEPTABLE);
        }
        User createdUser = userService.createUser(user);
        if (createdUser == null) {
            return new ResponseEntity<>("User not created, come again later", HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(createdUser, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User dbUser = userService.login(user);
        if (dbUser == null)
            return new ResponseEntity<>("Wrong Credentials", HttpStatus.NOT_ACCEPTABLE);
        return new ResponseEntity<>(dbUser, HttpStatus.OK);
    }

    // All tests (for user dashboard list)
    @GetMapping("/tests")
    public ResponseEntity<List<Testdto>> getAllTests() {
        return ResponseEntity.ok(userService.getAllTests());
    }

    // ✅ ADDED: single test by ID — frontend needs this to get timeLimit
    @GetMapping("/tests/{testId}")
    public ResponseEntity<Testdto> getTestById(@PathVariable Long testId) {
        return ResponseEntity.ok(testService.getTestById(testId));
    }

    // Questions for a test
    @GetMapping("/tests/{testId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsByTestId(@PathVariable Long testId) {
        return ResponseEntity.ok(userService.getQuestionsByTestId(testId));
    }

    // Submit test answers
    @PostMapping("/tests/{testId}/submit")
    public ResponseEntity<?> submitTest(
            @PathVariable Long testId,
            @RequestParam Long userId,
            @RequestBody Map<Long, Long> answers) {

        int score = userService.calculateScore(answers);
        TestResultDto result = userService.saveResult(userId, testId, score);
        return ResponseEntity.ok(result);
    }

    // ✅ FIXED: moved out of nested class — now a proper endpoint
    @GetMapping("/tests/{testId}/attempted")
    public Boolean hasAttempted(
            @PathVariable Long testId,
            @RequestParam Long userId) {
        return testResultRepository.existsByUserIdAndTestId(userId, testId);
    }
}