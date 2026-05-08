package com.cicloparqueadero.frontend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsView {
    private long total;
    private long parqueadas;
    private long retiradas;
    private long usuarios;
}
