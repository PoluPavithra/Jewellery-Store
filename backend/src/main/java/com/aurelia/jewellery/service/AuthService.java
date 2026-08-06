package com.aurelia.jewellery.service;

import com.aurelia.jewellery.dto.request.LoginRequest;
import com.aurelia.jewellery.dto.request.SignupRequest;
import com.aurelia.jewellery.dto.response.AuthResponse;
import com.aurelia.jewellery.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    UserResponse register(SignupRequest signupRequest);
    UserResponse getCurrentUser(String email);
}
