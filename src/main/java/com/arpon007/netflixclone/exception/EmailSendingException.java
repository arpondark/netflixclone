package com.arpon007.netflixclone.exception;

public class EmailSendingException extends RuntimeException{
    public EmailSendingException(String message,Throwable cause) {
        super(message,cause);
    }
}
