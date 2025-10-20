package com.ecomama.shared.exception;

public class NotFoundException extends DomainException {

    public NotFoundException(String message) {
        super(message, "NOT_FOUND");
    }

    public NotFoundException(String resourceName, Object identifier) {
        super(String.format("%s not found with identifier: %s", resourceName, identifier), "NOT_FOUND");
    }
}
