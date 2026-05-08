package com.cicloparqueadero.parqueadero.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad Bicicleta. Representa una bicicleta dentro del ciclo-parqueadero.
 */
@Entity
@Table(name = "bicicletas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bicicleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 120)
    @Column(nullable = false, length = 120)
    private String propietario;

    @NotBlank
    @Column(nullable = false, length = 40)
    private String documento;

    @NotBlank
    @Column(name = "tipo_bicicleta", nullable = false, length = 60)
    private String tipoBicicleta;

    @NotBlank
    @Column(nullable = false, length = 40)
    private String color;

    @Column(name = "hora_ingreso", nullable = false)
    private LocalDateTime horaIngreso;

    @Column(name = "hora_salida")
    private LocalDateTime horaSalida;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private Estado estado;

    @Column(length = 255)
    private String observaciones;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Estado {
        PARQUEADA, RETIRADA
    }

    @PrePersist
    public void prePersist() {
        if (horaIngreso == null) horaIngreso = LocalDateTime.now();
        if (estado == null) estado = Estado.PARQUEADA;
    }
}
