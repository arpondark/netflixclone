package com.arpon007.netflixclone.exception;

public class AccountDeactivatedException extends RuntimeException{
    public AccountDeactivatedException(String message) {
        super(message);
    }
}
