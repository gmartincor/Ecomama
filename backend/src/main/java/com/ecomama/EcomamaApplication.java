package com.ecomama;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for Ecomama platform.
 * 
 * Ecomama is a multi-user platform connecting farmers and consumers
 * for direct purchase of organic products.
 * 
 * @author Ecomama Team
 * @version 0.1.0
 */
@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
public class EcomamaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcomamaApplication.class, args);
    }
}
