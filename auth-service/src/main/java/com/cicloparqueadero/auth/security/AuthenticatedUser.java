package com.cicloparqueadero.auth.security;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Representación inmutable del usuario autenticado a partir del JWT.
 * Se almacena en el SecurityContext como principal.
 */
@Data
@AllArgsConstructor
public class AuthenticatedUser {
    private Long id;
    private String correo;
    private String rol;
}
