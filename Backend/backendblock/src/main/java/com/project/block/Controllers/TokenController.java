package com.project.block.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.ResposeData;

@RestController
@RequestMapping("/token")
public class TokenController {
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok(new ResposeData("Token is valid", 200, null));
    }
}
