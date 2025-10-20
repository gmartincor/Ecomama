package com.ecomama.shared.test;

import org.junit.jupiter.api.BeforeEach;

public abstract class BaseTest {
    
    @BeforeEach
    void baseSetUp() {
        TestDataCleaner.clear();
    }
}
