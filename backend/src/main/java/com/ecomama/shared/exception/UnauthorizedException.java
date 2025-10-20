package com.ecomama.shared.exception;

public class UnauthorizedException extends DomainException {

    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED");
    }
}
