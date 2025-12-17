package com.project.block.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.block.dto.ErrorResponse;
import com.project.block.dto.LoginSeccess;
import com.project.block.entity.User;
import com.project.block.models.UserService;
@CrossOrigin(origins = "http://localhost:4200")
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
            var curentuser  = this.Userservice.loginUser(user) ;
            if  (!curentuser.getStatus().equals("Active")){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    new ErrorResponse("User account is not active", 403)
                );
            }
            // Generate token (dummy implementation here)
            var jwtToken = Userservice.GenerateToken(curentuser) ;

            var response  = new LoginSeccess() ;   
            
            return ResponseEntity.status(HttpStatus.OK).body(response); // 200 OK
        } catch (Exception e ) {
            ErrorResponse error = new ErrorResponse(e.getMessage(), 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); // 400 error     
        }
    }
}
