package com.cicloparqueadero.parqueadero.service;

import com.cicloparqueadero.parqueadero.dto.BicicletaDTO;
import com.cicloparqueadero.parqueadero.dto.BicicletaRequest;
import com.cicloparqueadero.parqueadero.dto.StatsDTO;
import com.cicloparqueadero.parqueadero.entity.Bicicleta;
import com.cicloparqueadero.parqueadero.exception.NotFoundException;
import com.cicloparqueadero.parqueadero.repository.BicicletaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Capa de servicio para bicicletas. Centraliza la lógica de negocio.
 */
@Service
@RequiredArgsConstructor
public class BicicletaService {

    private final BicicletaRepository repository;

    @Transactional
    public BicicletaDTO create(BicicletaRequest req) {
        Bicicleta b = Bicicleta.builder()
                .propietario(req.getPropietario())
                .documento(req.getDocumento())
                .tipoBicicleta(req.getTipo_bicicleta())
                .color(req.getColor())
                .horaIngreso(req.getHora_ingreso() != null ? req.getHora_ingreso() : LocalDateTime.now())
                .horaSalida(req.getHora_salida())
                .estado(parseEstado(req.getEstado(), Bicicleta.Estado.PARQUEADA))
                .observaciones(req.getObservaciones())
                .build();
        return BicicletaDTO.from(repository.save(b));
    }

    public List<BicicletaDTO> list(String estadoStr, String search) {
        Bicicleta.Estado estado = null;
        if (estadoStr != null && !estadoStr.isBlank()) {
            try {
                estado = Bicicleta.Estado.valueOf(estadoStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // Si el estado es inválido, ignoramos el filtro.
            }
        }
        return repository.search(estado, search).stream()
                .map(BicicletaDTO::from)
                .toList();
    }

    public BicicletaDTO getById(Long id) {
        Bicicleta b = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bicicleta no encontrada"));
        return BicicletaDTO.from(b);
    }

    @Transactional
    public BicicletaDTO update(Long id, BicicletaRequest req) {
        Bicicleta b = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bicicleta no encontrada"));

        if (req.getPropietario() != null) b.setPropietario(req.getPropietario());
        if (req.getDocumento() != null) b.setDocumento(req.getDocumento());
        if (req.getTipo_bicicleta() != null) b.setTipoBicicleta(req.getTipo_bicicleta());
        if (req.getColor() != null) b.setColor(req.getColor());
        if (req.getHora_ingreso() != null) b.setHoraIngreso(req.getHora_ingreso());
        if (req.getHora_salida() != null) b.setHoraSalida(req.getHora_salida());
        if (req.getObservaciones() != null) b.setObservaciones(req.getObservaciones());
        if (req.getEstado() != null) {
            Bicicleta.Estado nuevo = parseEstado(req.getEstado(), b.getEstado());
            b.setEstado(nuevo);
            // Auto-completar hora_salida si pasa a RETIRADA y no se proporcionó.
            if (nuevo == Bicicleta.Estado.RETIRADA && req.getHora_salida() == null && b.getHoraSalida() == null) {
                b.setHoraSalida(LocalDateTime.now());
            }
        }
        return BicicletaDTO.from(repository.save(b));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Bicicleta no encontrada");
        }
        repository.deleteById(id);
    }

    public StatsDTO stats() {
        long total = repository.count();
        long parqueadas = repository.countByEstado(Bicicleta.Estado.PARQUEADA);
        long retiradas = repository.countByEstado(Bicicleta.Estado.RETIRADA);
        return StatsDTO.builder()
                .total(total)
                .parqueadas(parqueadas)
                .retiradas(retiradas)
                .build();
    }

    private Bicicleta.Estado parseEstado(String value, Bicicleta.Estado fallback) {
        if (value == null || value.isBlank()) return fallback;
        try {
            return Bicicleta.Estado.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + value);
        }
    }
}
