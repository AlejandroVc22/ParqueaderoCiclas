package com.cicloparqueadero.auth.config;

import com.cicloparqueadero.auth.entity.User;
import com.cicloparqueadero.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea automáticamente un usuario ADMIN al iniciar la aplicación si no existe.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByCorreo(adminEmail)) {
            log.info("[AUTH-SERVICE] Admin por defecto ya existe ({}).", adminEmail);
            return;
        }

        User admin = User.builder()
                .nombre(adminName)
                .correo(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .rol(User.Role.ADMIN)
                .build();
        userRepository.save(admin);

        log.info("========================================================");
        log.info("[AUTH-SERVICE] Admin por defecto creado:");
        log.info("  Correo:     {}", adminEmail);
        log.info("  Contraseña: {}", adminPassword);
        log.info("========================================================");
    }
}
