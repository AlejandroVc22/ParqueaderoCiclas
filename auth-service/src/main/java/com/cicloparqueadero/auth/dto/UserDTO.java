package com.cicloparqueadero.auth.dto;

import com.cicloparqueadero.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserDTO from(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .correo(user.getCorreo())
                .rol(user.getRol() != null ? user.getRol().name() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
