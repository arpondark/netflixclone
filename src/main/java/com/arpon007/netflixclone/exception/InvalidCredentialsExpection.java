package com.arpon007.netflixclone.exception;

public class InvalidCredentialsExpection extends RuntimeException{
    public InvalidCredentialsExpection(String message) {
        super(message);
    }
}
