package com.school.saas.exception;

public class SubscriptionLimitExceededException extends RuntimeException {
    public SubscriptionLimitExceededException(String message) {
        super(message);
    }
}
