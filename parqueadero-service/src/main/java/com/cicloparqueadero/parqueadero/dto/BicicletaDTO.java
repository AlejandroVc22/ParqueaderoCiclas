package com.cicloparqueadero.parqueadero.dto;

import com.cicloparqueadero.parqueadero.entity.Bicicleta;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BicicletaDTO {
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BicicletaDTO from(Bicicleta b) {
        if (b == null) return null;
        return BicicletaDTO.builder()
                .id(b.getId())
                .propietario(b.getPropietario())
                .documento(b.getDocumento())
                .tipoBicicleta(b.getTipoBicicleta())
                .color(b.getColor())
                .horaIngreso(b.getHoraIngreso())
                .horaSalida(b.getHoraSalida())
                .estado(b.getEstado() != null ? b.getEstado().name() : null)
                .observaciones(b.getObservaciones())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
