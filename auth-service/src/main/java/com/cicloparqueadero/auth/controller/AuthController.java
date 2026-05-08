package com.cicloparqueadero.auth.controller;

import com.cicloparqueadero.auth.dto.*;
import com.cicloparqueadero.auth.security.AuthenticatedUser;
import com.cicloparqueadero.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse data = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(data, "Usuario registrado exitosamente"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse data = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok(data, "Inicio de sesión exitoso"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> profile(@AuthenticationPrincipal AuthenticatedUser principal) {
        UserDTO data = authService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/users/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> count() {
        long total = authService.countUsers();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("total", total)));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> listUsers() {
        List<UserDTO> users = authService.getAllUsers();
        ApiResponse<List<UserDTO>> resp = ApiResponse.ok(users);
        resp.setTotal(users.size());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<AuthenticatedUser>> validate(
            @AuthenticationPrincipal AuthenticatedUser principal) {
        return ResponseEntity.ok(ApiResponse.ok(principal));
    }
}
