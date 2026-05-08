package com.cicloparqueadero.frontend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BicicletaView {
    private Long id;
    private String propietario;
    private String documento;

    @JsonProperty("tipo_bicicleta")
    private String tipoBicicleta;

    private String color;

    @JsonProperty("hora_ingreso")
    private LocalDateTime horaIngreso;

    @JsonProperty("hora_salida")
    private LocalDateTime horaSalida;

    private String estado;
    private String observaciones;
}
