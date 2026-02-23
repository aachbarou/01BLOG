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

    /**
     * Constructor for AuthController
     * 
     * @param IUserService Service for user management
     */
    public AuthController(UserService IUserService) {
        this.Userservice = IUserService;
    }

    /**
     * Endpoint to register a new user
     * 
     * @param user User data
     * @return ResponseEntity with status
     */
    @PostMapping("/Register")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        System.out.println("Registering user: ??????????????????????????+++++++++++++++" + user);
        try {
            Userservice.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse(e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Endpoint to login a user
     * 
     * @param user User credentials
     * @return ResponseEntity with token or error
     */
    @PostMapping("/Login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            var curentuser = this.Userservice.loginUser(user);
            if (curentuser.isBanned()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        new ErrorResponse("User account is banned", 403));
            }

            var response = new LoginSeccess(Userservice.GenerateNewToken(curentuser));

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (IllegalArgumentException e) {
            ErrorResponse error = new ErrorResponse(e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse(e.getMessage(), 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
