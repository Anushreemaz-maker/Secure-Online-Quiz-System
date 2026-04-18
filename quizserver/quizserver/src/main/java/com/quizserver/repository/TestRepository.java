package com.quizserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quizserver.entities.Test;

public interface TestRepository extends JpaRepository<Test, Long> {
}