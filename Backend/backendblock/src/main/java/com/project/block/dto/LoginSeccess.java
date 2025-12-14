package com.project.block.dto;

import lombok.Data;

@Data
public class LoginSeccess {
    private String Banned  ;
    private String token;
    public LoginSeccess(boolean  Banned) {
        this.token = "dummy-token";
        this.Banned = Banned ? "true" : "false";  
    }
}
    