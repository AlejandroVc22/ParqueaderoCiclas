package com.cicloparqueadero.parqueadero.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticatedUser {
    private Long id;
    private String correo;
    private String rol;
}
