package com.cicloparqueadero.parqueadero.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BicicletaRequest {

    @NotBlank(message = "El propietario es obligatorio")
    private String propietario;

    @NotBlank(message = "El documento es obligatorio")
    private String documento;

    @NotBlank(message = "El tipo de bicicleta es obligatorio")
    private String tipo_bicicleta;

    @NotBlank(message = "El color es obligatorio")
    private String color;

    private LocalDateTime hora_ingreso;
    private LocalDateTime hora_salida;

    /** Acepta "PARQUEADA" o "RETIRADA". */
    private String estado;

    private String observaciones;
}
