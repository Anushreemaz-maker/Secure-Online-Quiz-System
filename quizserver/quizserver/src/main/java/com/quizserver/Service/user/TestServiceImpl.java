package com.quizserver.Service.user;

import com.quizserver.dto.Testdto;
import com.quizserver.entities.Test;
import com.quizserver.repository.TestRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestServiceImpl implements TestService {

    private final TestRepository testrepository;

    public TestServiceImpl(TestRepository testrepository) {
        this.testrepository = testrepository;
    }

    @Override
    public List<Testdto> getAllTests() {
        return testrepository.findAll().stream().map(test -> {
            Testdto dto = new Testdto();
            dto.setId(test.getId());
            dto.setTitle(test.getTitle());
            dto.setDescription(test.getDescription());
            dto.setTimeLimit(test.getTimeLimit());
            return dto;
        }).collect(Collectors.toList());
    }
    @Override
    public Testdto createTest(Testdto testdto) {

        // 1️⃣ Build entity
        Test test = new Test();
        test.setTitle(testdto.getTitle());
        test.setDescription(testdto.getDescription());
        test.setTimeLimit(testdto.getTimeLimit());

        // 2️⃣ Save to DB
        Test saved = testrepository.save(test);

        // 3️⃣ Map back to DTO (with id!)
        Testdto response = new Testdto();
        response.setId(saved.getId());           // ← id now returned!
        response.setTitle(saved.getTitle());
        response.setDescription(saved.getDescription());
        response.setTimeLimit(saved.getTimeLimit());

        return response;
    }
    @Override
    public Testdto getTestById(Long id) {
        Test test = testrepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found: " + id));

        Testdto dto = new Testdto();
        dto.setId(test.getId());
        dto.setTitle(test.getTitle());
        dto.setDescription(test.getDescription());
        dto.setTimeLimit(test.getTimeLimit());   // ← this is what the frontend needs
        return dto;
    }

}