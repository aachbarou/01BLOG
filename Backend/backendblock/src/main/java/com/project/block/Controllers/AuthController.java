package com.project.block.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.ErrorResponse;
import com.project.block.dto.LoginSeccess;
import com.project.block.entity.User;
import com.project.block.models.UserService;

@RestController
@RequestMapping("/Auth")
public class AuthController {

    private final UserService Userservice;

    public AuthController(UserService IUserService) {
        this.Userservice = IUserService;
    }

    @PostMapping("/Register")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            Userservice.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).build(); // 201 OK
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse(e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); // 400 error
        }
    }

    @PostMapping("/Login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            LoginSeccess response = new LoginSeccess(
                   Userservice.loginUser(user).getStatus().equals("Banned")
            );
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse(e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); // 400 error     
        }
    }
}
