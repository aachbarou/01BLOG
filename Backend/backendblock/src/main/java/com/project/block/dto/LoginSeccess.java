package com.project.block.dto;

import lombok.Data;

@Data
public class LoginSeccess {
    private   String token;
    private   String message;
    public LoginSeccess( String token ) {
        this.token =  token;
        this.message =  "Login successful.";
    }
}
