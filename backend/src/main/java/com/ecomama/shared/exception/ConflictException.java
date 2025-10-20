package com.ecomama.shared.exception;

public class ConflictException extends DomainException {

    public ConflictException(String message) {
        super(message, "CONFLICT");
    }
}
