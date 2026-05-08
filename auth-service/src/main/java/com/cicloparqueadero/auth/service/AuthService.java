package com.cicloparqueadero.auth.service;

import com.cicloparqueadero.auth.dto.AuthResponse;
import com.cicloparqueadero.auth.dto.LoginRequest;
import com.cicloparqueadero.auth.dto.RegisterRequest;
import com.cicloparqueadero.auth.dto.UserDTO;
import com.cicloparqueadero.auth.entity.User;
import com.cicloparqueadero.auth.exception.BadRequestException;
import com.cicloparqueadero.auth.exception.NotFoundException;
import com.cicloparqueadero.auth.exception.UnauthorizedException;
import com.cicloparqueadero.auth.repository.UserRepository;
import com.cicloparqueadero.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Capa de servicio del módulo de autenticación.
 * Lógica: registrar, autenticar, obtener perfil y listar usuarios.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByCorreo(req.getCorreo())) {
            throw new BadRequestException("El correo ya se encuentra registrado");
        }

        User.Role rol;
        try {
            rol = req.getRol() != null ? User.Role.valueOf(req.getRol()) : User.Role.USER;
        } catch (IllegalArgumentException e) {
            rol = User.Role.USER;
        }

        User user = User.builder()
                .nombre(req.getNombre())
                .correo(req.getCorreo())
                .password(passwordEncoder.encode(req.getPassword()))
                .rol(rol)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return AuthResponse.builder()
                .user(UserDTO.from(saved))
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByCorreo(req.getCorreo())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder()
                .user(UserDTO.from(user))
                .token(token)
                .build();
    }

    public UserDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        return UserDTO.from(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(UserDTO::from)
                .toList();
    }

    public long countUsers() {
        return userRepository.count();
    }
}
