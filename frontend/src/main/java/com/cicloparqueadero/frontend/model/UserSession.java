package com.cicloparqueadero.frontend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Datos del usuario autenticado guardados en HttpSession.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSession implements Serializable {
    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private String token;

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(rol);
    }
}
