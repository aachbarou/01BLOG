package com.project.block.dto;

import lombok.Data;

@Data
public class ResposeData {
    private String message;
    private int status;
    private Object data;
    public ResposeData(String message, int status, Object data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
}
