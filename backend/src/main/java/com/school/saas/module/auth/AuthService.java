package com.school.saas.module.auth;

import com.school.saas.module.user.UserDTO;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    LoginResponse refreshToken(String refreshToken);

    UserDTO register(RegisterRequest request);

    void logout();

    UserDTO getCurrentUser();
}
