package com.quizserver.controller;

import com.quizserver.dto.Testdto;
import com.quizserver.Service.user.TestService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/admin/tests")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @PostMapping
    public Testdto createTest(@RequestBody Testdto testdto) {
        //   ^^^^^^^ return DTO not Entity
        return testService.createTest(testdto);
    }
    @GetMapping
    public List<Testdto> getAllTests() {
        return testService.getAllTests();
    }
    @GetMapping("/{id}")
    public Testdto getTestById(@PathVariable Long id) {
        return testService.getTestById(id);
    }
}