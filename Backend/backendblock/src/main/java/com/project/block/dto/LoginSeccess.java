package com.project.block.dto;

import lombok.Data;

@Data
public class LoginSeccess {
    private String Banned  ;
    public LoginSeccess(boolean  Banned) {
        this.Banned = Banned ? "true" : "false";  
    }
}
