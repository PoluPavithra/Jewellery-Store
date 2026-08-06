package com.aurelia.jewellery.service.impl;

import com.aurelia.jewellery.dto.request.LoginRequest;
import com.aurelia.jewellery.dto.request.SignupRequest;
import com.aurelia.jewellery.dto.response.AuthResponse;
import com.aurelia.jewellery.dto.response.UserResponse;
import com.aurelia.jew стимули.exception.BadRequestException;
import com.aurelia.jewellery.exception.BadRequestException;
import com.aurelia.jewellery.exception.ResourceNotFoundException;
import com.aurelia.jewellery.model.Cart;
import com.aurelia.jewellery.model.Role;
import com.aurelia.jewellery.model.User;
import com.aurelia.jewellery.model.Wishlist;
import com.aurelia.jewellery.repository.CartRepository;
import com.aurelia.jewellery.repository.UserRepository;
import com.aurelia.jewellery.repository.WishlistRepository;
import com.aurelia.jewellery.security.jwt.JwtUtils;
import com.aurelia.jewellery.security.services.UserDetailsImpl;
import com.aurelia.jewellery.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getEmail()));

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(userResponse)
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new BadRequestException("Email is already registered: " + signupRequest.getEmail());
        }

        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .fullName(signupRequest.getFullName())
                .phone(signupRequest.getPhone())
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);

        // Initialize Cart and Wishlist for user
        Cart cart = Cart.builder().user(savedUser).build();
        cartRepository.save(cart);

        Wishlist wishlist = Wishlist.builder().user(savedUser).build();
        wishlistRepository.save(wishlist);

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .build();
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
