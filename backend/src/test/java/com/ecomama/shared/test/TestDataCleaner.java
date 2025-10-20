package com.ecomama.shared.test;

import java.util.ArrayList;
import java.util.List;

public final class TestDataCleaner {
    
    private static final ThreadLocal<List<Runnable>> CLEANUP_TASKS = ThreadLocal.withInitial(ArrayList::new);
    
    private TestDataCleaner() {
    }
    
    public static void registerCleanup(Runnable cleanupTask) {
        CLEANUP_TASKS.get().add(cleanupTask);
    }
    
    public static void clear() {
        List<Runnable> tasks = CLEANUP_TASKS.get();
        tasks.forEach(Runnable::run);
        tasks.clear();
    }
}
