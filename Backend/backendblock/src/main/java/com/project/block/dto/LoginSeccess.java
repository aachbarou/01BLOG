package com.project.block.dto;

import lombok.Data;

@Data
public class LoginSeccess {
    private   String token;
    private   String message;
    public LoginSeccess() {
        this.token =  "dummy-token" ;
        this.message =  "Login successful.";
    }
}
