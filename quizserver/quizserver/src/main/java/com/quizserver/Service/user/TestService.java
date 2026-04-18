package com.quizserver.Service.user;

import com.quizserver.dto.Testdto;
import java.util.List;

public interface TestService {
    Testdto createTest(Testdto testDto);
    List<Testdto> getAllTests();// ← Testdto not Test
    Testdto getTestById(Long id);
}