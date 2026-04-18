package com.quizserver.repository;

import com.quizserver.entities.Test;
import com.quizserver.entities.TestResult;
import com.quizserver.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserId(Long userId);
    List<TestResult> findByTestId(Long testId);

    Optional<TestResult> findByUserAndTest(User user, com.quizserver.entities.Test test);
    boolean existsByUserIdAndTestId(Long userId, Long testId);
}